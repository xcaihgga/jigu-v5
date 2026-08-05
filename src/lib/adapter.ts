/**
 * 数据适配器（Adapter）
 * 
 * 作用：将现有的纯 JavaScript 临床数据适配到 TypeScript 数据契约，
 * 并在运行时进行自动校验，确保数据的安全性和一致性。
 * 
 * 设计模式：适配器模式 + 代理模式
 */

import { DataValidator, createScale, createProtocol, Scale, Protocol } from './validator';

// ========== 量表适配器 ==========

/**
 * 从原始 JS 数据转换为安全的 Scale 对象
 * 会自动运行数据校验，不合格数据会被拒绝
 */
export function adaptScale(raw: any): Scale {
  if (!raw || !raw.id || !raw.name) {
    throw new Error('量表缺少必要的 id 和 name 字段');
  }

  // 预处理：将基于数组索引的 calculate 函数包装为基于 questionId 的访问
  const wrappedCalculate = wrapCalculateFunction(raw);
  
  const scaleConfig: any = {
    id: raw.id,
    name: raw.name,
    shortName: raw.shortName || raw.id.toUpperCase(),
    category: raw.category || 'uncategorized',
    
    // 元数据（补齐缺失字段）
    version: raw.version || '1.0.0',
    source: raw.source || raw.reference || '临床常规应用',
    lastUpdated: raw.lastUpdated || new Date().toISOString().split('T')[0],
    
    description: raw.description || '',
    reliability: raw.reliability || '信度良好',
    reference: raw.reference || '',
    
    type: raw.type || 'number',
    question: raw.question,
    labels: raw.labels || [],
    
    // 仅当原始数据有 totalScore 时才设置，否则让验证器检测
    ...(raw.totalScore !== undefined ? { totalScore: raw.totalScore } : {}),
    
    // 仅当原始数据有 interpretation 时才映射，否则让验证器检测
    ...(raw.interpretation ? {
      interpretation: raw.interpretation.map((item: any) => ({
        min: item.min ?? 0,
        max: item.max ?? 10,
        level: item.level || '未知',
        color: item.color || 'info',
        desc: item.desc || ''
      }))
    } : {}),
    
    calculate: wrappedCalculate
  };

  // 保留原始 questions 数据（如果存在）
  if (raw.questions) {
    scaleConfig.questions = raw.questions;
  }
  
  // 使用工厂创建，自动触发校验
  return createScale(scaleConfig);
}

/**
 * 批量适配量表数据
 */
export function adaptScales(rawScales: any[]): {
  scales: Scale[];
  errors: { id: string; name: string; errors: ReturnType<typeof DataValidator.validateScale> }[];
} {
  const scales: Scale[] = [];
  const errors: any[] = [];
  
  for (const raw of rawScales) {
    try {
      const scale = adaptScale(raw);
      scales.push(scale);
    } catch (e: any) {
      console.error(`❌ 量表适配失败 [${raw.id}]:`, e.message);
      errors.push({
        id: raw.id,
        name: raw.name,
        errors: [{ field: 'creation', message: e.message, severity: 'error' }]
      });
    }
  }
  
  // 全局验证
  const validation = DataValidator.validateAllScales(scales);
  if (validation.summary.invalid > 0) {
    console.warn(`⚠️ 有 ${validation.summary.invalid} 个量表未通过二次验证`);
  }
  
  return { scales, errors };
}

/**
 * 包装 calculate 函数：将基于索引的数组访问转换为基于 ID 的访问
 * 
 * 问题：原始数据使用 answers[0], answers[1] 访问答案
 * 风险：问题顺序改变时，分数计算会出错
 * 解决方案：将对象格式的 answers 转换为数组格式，同时支持两种访问方式
 */
function wrapCalculateFunction(raw: any): (answers: Record<string, number | string>) => { score: number; maxScore: number; details?: Record<string, any> } {
  const originalCalc = raw.calculate;
  if (typeof originalCalc !== 'function') {
    // 返回一个安全的默认计算函数
    return (answers: any) => {
      const values = Object.values(answers).map(v => typeof v === 'number' ? v : 0);
      const score = values.reduce((a, b) => a + b, 0);
      return { score, maxScore: raw.totalScore || 10 };
    };
  }
  
  // 如果原始函数接受数组参数，保持向后兼容
  return function(answers: Record<string, number | string>) {
    // 将对象格式的 answers 转换为数组格式
    // 优先使用 questions 定义的顺序
    let arrayAnswers: any[] = [];
    
    if (raw.questions && Array.isArray(raw.questions)) {
      // 按 questions 顺序提取答案
      arrayAnswers = raw.questions.map((q: any, idx: number) => {
        const val = answers[q.id] ?? answers[q.order] ?? answers[idx];
        return val !== undefined ? val : 0;
      });
    } else {
      // 简单量表：直接取 values 作为数组
      const values = Object.values(answers);
      arrayAnswers = values.map(v => typeof v === 'number' || typeof v === 'string' ? v : 0);
      // 如果只有一个键（如 VAS/NRS），直接取第一个值
      if (arrayAnswers.length === 0) {
        arrayAnswers = [answers['q0'] ?? answers[0] ?? 0];
      }
    }
    
    try {
      const result = originalCalc(arrayAnswers);
      return normalizeResult(result, raw.totalScore);
    } catch (e) {
      console.error(`[Calculator Error] 量表 ${raw.id} 计算失败:`, e);
      return { score: 0, maxScore: raw.totalScore || 10 };
    }
  };
}

/**
 * 标准化计算结果
 */
function normalizeResult(result: any, totalScore: number): { score: number; maxScore: number; details?: Record<string, any> } {
  if (!result || typeof result !== 'object') {
    return { score: 0, maxScore: totalScore };
  }
  
  return {
    score: typeof result.score === 'number' ? result.score : 0,
    maxScore: typeof result.maxScore === 'number' ? result.maxScore : totalScore,
    details: result.details
  };
}

// ========== 协议适配器 ==========

/**
 * 适配协议数据
 * 
 * 支持多种旧格式：
 * - 标准协议：{ phases, indications, contraindications }
 * - 康复方案（protocols-pro.js）：{ stages, goal, exercises, cautions }
 * - 术后协议：{ phase, therapeuticGoals, treatments, progressCriteria }
 */
export function adaptProtocol(raw: any): Protocol {
  if (!raw || !raw.id || !raw.name) {
    throw new Error('协议缺少必要的 id 和 name 字段');
  }

  // 识别并转换阶段数据
  const rawPhases: any[] = 
    (Array.isArray(raw.phases) && raw.phases.length > 0 && raw.phases[0]?.name) ? raw.phases :
    (Array.isArray(raw.stages) && raw.stages.length > 0 ? raw.stages :
    (Array.isArray(raw.phase) ? raw.phase : []));

  if (rawPhases.length === 0) {
    throw new Error(`协议 "${raw.name}" 缺少分期数据 (phases/stages/phase)`);
  }

  const phases = rawPhases.map((phase: any) => {
    // 统一字段命名
    const goals = phase.goals || phase.therapeuticGoals || (phase.goal ? [phase.goal] : []);
    const interventions = phase.interventions || phase.treatments || phase.exercises || [];
    const criteria = phase.criteria || phase.progressCriteria || phase.cautions || [];
    
    return {
      name: phase.name || phase.phaseName || '未知分期',
      duration: phase.duration || '',
      goals: Array.isArray(goals) ? goals : [String(goals)],
      interventions: Array.isArray(interventions) ? interventions : [String(interventions)],
      criteria: Array.isArray(criteria) ? criteria : [String(criteria)]
    };
  });

  // 推导协议类型
  let type = raw.type;
  if (!type) {
    const idStr = (raw.id || '').toLowerCase();
    if (idStr.includes('stroke') || idStr.includes('neuro')) type = 'neuro';
    else if (idStr.includes('postop') || idStr.includes('术后')) type = 'postop';
    else if (idStr.includes('pain') || idStr.includes('疼痛')) type = 'pain';
    else type = 'rehab';
  }

  // 推导 indications / contraindications（从描述中提取或留空）
  const indications = Array.isArray(raw.indications) && raw.indications.length > 0
    ? raw.indications
    : (raw.evidence ? [raw.evidence] : []);
  const contraindications = Array.isArray(raw.contraindications) && raw.contraindications.length > 0
    ? raw.contraindications
    : [];

  // 推导来源
  const source = raw.source || raw.evidence || raw.reference || '临床指南';

  return createProtocol({
    id: raw.id,
    name: raw.name,
    type,
    version: raw.version || '1.0.0',
    source,
    lastUpdated: raw.lastUpdated || new Date().toISOString().split('T')[0],
    description: raw.description || '',
    indications,
    contraindications,
    phases
  });
}

/**
 * 批量适配协议
 */
export function adaptProtocols(rawProtocols: any[]): {
  protocols: Protocol[];
  errors: { id: string; name: string; message: string }[];
} {
  const protocols: Protocol[] = [];
  const errors: any[] = [];
  
  for (const raw of rawProtocols) {
    try {
      const protocol = adaptProtocol(raw);
      protocols.push(protocol);
    } catch (e: any) {
      console.error(`❌ 协议适配失败 [${raw.id}]:`, e.message);
      errors.push({ id: raw.id, name: raw.name, message: e.message });
    }
  }
  
  return { protocols, errors };
}

// ========== 安全访问器 ==========

/**
 * 安全获取量表列表（附带版本信息）
 */
export function getScalesMeta(scales: Scale[]): Array<Pick<Scale, 'id' | 'name' | 'version' | 'source' | 'category'>> {
  return scales.map(s => ({
    id: s.id,
    name: s.name,
    version: s.version,
    source: s.source,
    category: s.category
  }));
}

/**
 * 获取所有数据的版本信息（用于显示在 UI 上）
 */
export function getDataVersionInfo(scales: Scale[], protocols: Protocol[]): {
  scales: { count: number; versions: string[]; sources: string[] };
  protocols: { count: number; versions: string[]; sources: string[] };
  generatedAt: string;
} {
  return {
    scales: {
      count: scales.length,
      versions: [...new Set(scales.map(s => s.version))],
      sources: [...new Set(scales.map(s => s.source))]
    },
    protocols: {
      count: protocols.length,
      versions: [...new Set(protocols.map(p => p.version))],
      sources: [...new Set(protocols.map(p => p.source))]
    },
    generatedAt: new Date().toISOString()
  };
}
