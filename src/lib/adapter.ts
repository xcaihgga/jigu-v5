/**
 * ⚠️ 状态：TypeScript 架构草稿，**不在当前 index.html 单文件主链路运行**。
 * ⚠️ 启用条件：需添加 tsconfig.json + 构建脚本（如 tsc/esbuild），编译输出到 src/ 目录后由 index.html 引入。
 *
 * 数据适配器（Adapter）
 * 
 * 作用：将现有的纯 JavaScript 临床数据适配到 TypeScript 数据契约，
 * 并在运行时进行自动校验，确保数据的安全性和一致性。
 * 
 * 设计模式：适配器模式 + 代理模式
 */

import { DataValidator, createScale, createProtocol, Scale, Protocol } from './validator';
import { logger } from './logger';

// ========== 量表适配器 ==========

/**
 * 从原始 JS 数据转换为安全的 Scale 对象
 * 会自动运行数据校验，不合格数据会被拒绝
 */
export function adaptScale(raw: any): Scale {
  if (!raw || !raw.id || !raw.name) {
    logger.warn('adaptScale: 量表缺少必要的 id 或 name 字段', {
      hasId: !!(raw && raw.id),
      hasName: !!(raw && raw.name),
      rawKeys: raw ? Object.keys(raw).slice(0, 8) : null
    });
    throw new Error('量表缺少必要的 id 和 name 字段');
  }

  logger.info(`adaptScale: 适配量表 "${raw.name}" [${raw.id}]`, {
    category: raw.category || 'uncategorized',
    hasQuestions: Array.isArray(raw.questions),
    questionCount: Array.isArray(raw.questions) ? raw.questions.length : 0,
    hasCalculate: typeof raw.calculate === 'function',
    hasTotalScore: raw.totalScore !== undefined,
    hasInterpretation: Array.isArray(raw.interpretation),
    hasReference: !!(raw.reference || raw.source)
  });

  const wrappedCalculate = wrapCalculateFunction(raw);
  
  const scaleConfig: any = {
    id: raw.id,
    name: raw.name,
    shortName: raw.shortName || raw.id.toUpperCase(),
    category: raw.category || 'uncategorized',
    
    version: raw.version || '1.0.0',
    source: raw.source || raw.reference || '临床常规应用',
    lastUpdated: raw.lastUpdated || new Date().toISOString().split('T')[0],
    
    description: raw.description || '',
    reliability: raw.reliability || '信度良好',
    reference: raw.reference || '',
    
    type: raw.type || 'number',
    question: raw.question,
    labels: raw.labels || [],
    
    ...(raw.totalScore !== undefined ? { totalScore: raw.totalScore } : {}),
    
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

  if (raw.questions) {
    scaleConfig.questions = raw.questions;
  }
  
  const created = createScale(scaleConfig);
  logger.info(`adaptScale: 量表 "${raw.name}" [${raw.id}] 适配成功`, {
    finalCategory: created.category,
    finalVersion: created.version,
    finalSource: created.source,
    questionCount: Array.isArray(created.questions) ? created.questions.length : 0,
    interpretationCount: Array.isArray(created.interpretation) ? created.interpretation.length : 0
  });
  return created;
}

/**
 * 批量适配量表数据
 */
export function adaptScales(rawScales: any[]): {
  scales: Scale[];
  errors: { id: string; name: string; errors: ReturnType<typeof DataValidator.validateScale> }[];
} {
  logger.info(`adaptScales: 开始批量适配 ${rawScales.length} 个量表`);
  const scales: Scale[] = [];
  const errors: any[] = [];
  
  for (let i = 0; i < rawScales.length; i++) {
    const raw = rawScales[i];
    try {
      const scale = adaptScale(raw);
      scales.push(scale);
    } catch (e: any) {
      logger.error(`adaptScales: 第${i + 1}/${rawScales.length}个量表适配失败 [${raw?.id}]`, e.message);
      errors.push({
        id: raw.id,
        name: raw.name,
        errors: [{ field: 'creation', message: e.message, severity: 'error' }]
      });
    }
  }
  
  const validation = DataValidator.validateAllScales(scales);
  if (validation.summary.invalid > 0) {
    logger.warn(`adaptScales: 二次验证发现 ${validation.summary.invalid}/${scales.length} 个无效量表`);
  }
  
  logger.info(`adaptScales: 适配完成 - 成功 ${scales.length}, 失败 ${errors.length}`);
  return { scales, errors };
}

/**
 * 包装 calculate 函数：将基于索引的数组访问转换为基于 ID 的访问
 */
function wrapCalculateFunction(raw: any): (answers: Record<string, number | string>) => { score: number; maxScore: number; details?: Record<string, any> } {
  const originalCalc = raw.calculate;
  if (typeof originalCalc !== 'function') {
    logger.warn(`wrapCalculateFunction: 量表 ${raw.id} 无 calculate 函数，使用默认求和计算`);
    return (answers: any) => {
      const values = Object.values(answers).map(v => typeof v === 'number' ? v : 0);
      const score = values.reduce((a, b) => a + b, 0);
      return { score, maxScore: raw.totalScore || 10 };
    };
  }
  
  return function(answers: Record<string, number | string>) {
    let arrayAnswers: any[] = [];
    
    if (raw.questions && Array.isArray(raw.questions)) {
      arrayAnswers = raw.questions.map((q: any, idx: number) => {
        const val = answers[q.id] ?? answers[q.order] ?? answers[idx];
        return val !== undefined ? val : 0;
      });
    } else {
      const values = Object.values(answers);
      arrayAnswers = values.map(v => typeof v === 'number' || typeof v === 'string' ? v : 0);
      if (arrayAnswers.length === 0) {
        arrayAnswers = [answers['q0'] ?? answers[0] ?? 0];
      }
    }
    
    try {
      const result = originalCalc(arrayAnswers);
      return normalizeResult(result, raw.totalScore);
    } catch (e) {
      logger.error(`wrapCalculateFunction: 量表 ${raw.id} 计算异常，返回默认 0 分`, e);
      return { score: 0, maxScore: raw.totalScore || 10 };
    }
  };
}

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
 */
export function adaptProtocol(raw: any): Protocol {
  if (!raw || !raw.id || !raw.name) {
    logger.warn('adaptProtocol: 协议缺少必要的 id 或 name 字段', {
      hasId: !!(raw && raw.id),
      hasName: !!(raw && raw.name),
      rawKeys: raw ? Object.keys(raw).slice(0, 8) : null
    });
    throw new Error('协议缺少必要的 id 和 name 字段');
  }

  const phaseSource = Array.isArray(raw.phases) && raw.phases.length > 0 && raw.phases[0]?.name
    ? 'phases'
    : (Array.isArray(raw.stages) && raw.stages.length > 0 ? 'stages'
    : (Array.isArray(raw.phase) ? 'phase' : 'none'));

  const rawPhases: any[] = 
    (Array.isArray(raw.phases) && raw.phases.length > 0 && raw.phases[0]?.name) ? raw.phases :
    (Array.isArray(raw.stages) && raw.stages.length > 0 ? raw.stages :
    (Array.isArray(raw.phase) ? raw.phase : []));

  logger.info(`adaptProtocol: 适配协议 "${raw.name}" [${raw.id}]`, {
    phaseSource,
    phaseCount: rawPhases.length,
    hasGoal: !!raw.goal,
    hasExercises: Array.isArray(raw.exercises),
    hasEvidence: !!raw.evidence,
    hasSource: !!(raw.source || raw.reference)
  });

  if (rawPhases.length === 0) {
    throw new Error(`协议 "${raw.name}" 缺少分期数据 (phases/stages/phase)`);
  }

  const phases = rawPhases.map((phase: any, idx: number) => {
    const goals = phase.goals || phase.therapeuticGoals || (phase.goal ? [phase.goal] : []);
    const interventions = phase.interventions || phase.treatments || phase.exercises || [];
    const criteria = phase.criteria || phase.progressCriteria || phase.cautions || [];
    
    return {
      name: phase.name || phase.phaseName || `未知分期${idx + 1}`,
      duration: phase.duration || '',
      goals: Array.isArray(goals) ? goals : [String(goals)],
      interventions: Array.isArray(interventions) ? interventions : [String(interventions)],
      criteria: Array.isArray(criteria) ? criteria : [String(criteria)]
    };
  });

  let type = raw.type;
  if (!type) {
    const idStr = (raw.id || '').toLowerCase();
    if (idStr.includes('stroke') || idStr.includes('neuro')) type = 'neuro';
    else if (idStr.includes('postop') || idStr.includes('术后')) type = 'postop';
    else if (idStr.includes('pain') || idStr.includes('疼痛')) type = 'pain';
    else type = 'rehab';
    logger.info(`adaptProtocol: 协议 "${raw.name}" 类型自动推导为 "${type}"`);
  }

  const indications = Array.isArray(raw.indications) && raw.indications.length > 0
    ? raw.indications
    : (raw.evidence ? [raw.evidence] : []);
  const contraindications = Array.isArray(raw.contraindications) && raw.contraindications.length > 0
    ? raw.contraindications
    : [];

  const source = raw.source || raw.evidence || raw.reference || '临床指南';

  const created = createProtocol({
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

  logger.info(`adaptProtocol: 协议 "${raw.name}" [${raw.id}] 适配成功`, {
    finalType: created.type,
    finalVersion: created.version,
    phaseCount: created.phases.length,
    indicationCount: created.indications.length,
    contraindicationCount: created.contraindications.length
  });
  return created;
}

/**
 * 批量适配协议
 */
export function adaptProtocols(rawProtocols: any[]): {
  protocols: Protocol[];
  errors: { id: string; name: string; message: string }[];
} {
  logger.info(`adaptProtocols: 开始批量适配 ${rawProtocols.length} 个协议`);
  const protocols: Protocol[] = [];
  const errors: any[] = [];
  
  for (let i = 0; i < rawProtocols.length; i++) {
    const raw = rawProtocols[i];
    try {
      const protocol = adaptProtocol(raw);
      protocols.push(protocol);
    } catch (e: any) {
      logger.error(`adaptProtocols: 第${i + 1}/${rawProtocols.length}个协议适配失败 [${raw?.id}]`, e.message);
      errors.push({ id: raw.id, name: raw.name, message: e.message });
    }
  }
  
  logger.info(`adaptProtocols: 适配完成 - 成功 ${protocols.length}, 失败 ${errors.length}`);
  return { protocols, errors };
}

// ========== 安全访问器 ==========

export function getScalesMeta(scales: Scale[]): Array<Pick<Scale, 'id' | 'name' | 'version' | 'source' | 'category'>> {
  return scales.map(s => ({
    id: s.id,
    name: s.name,
    version: s.version,
    source: s.source,
    category: s.category
  }));
}

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
