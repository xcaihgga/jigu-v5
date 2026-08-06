/**
 * ⚠️ 状态：TypeScript 架构草稿，**不在当前 index.html 单文件主链路运行**。
 * ⚠️ 启用条件：需添加 tsconfig.json + 构建脚本（如 tsc/esbuild），编译输出到 src/ 目录后由 index.html 引入。
 *
 * 临床数据契约与验证器
 * 
 * 第一性原理：临床数据是医疗应用的"血液"，必须保证其：
 * 1.  完整性（Complete）：所有必要字段必须存在
 * 2.  一致性（Consistent）：总分与分级标准必须匹配
 * 3.  可追溯性（Traceable）：必须有来源和版本信息
 * 4.  自洽性（Self-consistent）：计算逻辑必须能被验证
 */

// ========== 类型契约 ==========

/** 量表类型枚举 */
export type ScaleType = 'slider' | 'number' | 'choice' | 'boolean';

/** 量表题目类型 */
export type QuestionType = 'single' | 'multiple' | 'text' | 'number';

/** 分级解读 */
export interface Interpretation {
  min: number;
  max: number;
  level: string;
  color: 'success' | 'warning' | 'danger' | 'info';
  desc: string;
}

/** 量表题目 */
export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  required: boolean;
  options?: { value: number; label: string }[];
  min?: number;
  max?: number;
  step?: number;
}

/** 量表核心接口 */
export interface Scale {
  // 标识
  id: string;
  name: string;
  shortName: string;
  category: string;
  
  // 元数据（临床溯源）
  version: string;
  source: string;        // 指南/文献来源
  lastUpdated: string;   // ISO 日期
  
  // 内容
  description: string;
  reliability: string;
  reference: string;
  
  // 结构
  totalScore: number;
  type: ScaleType;
  questions?: Question[];  // 结构化题目（可选）
  question?: string;       // 简单提问（单维度量表）
  labels?: string[];       // 量表标签
  
  // 分级标准
  interpretation: Interpretation[];
  
  // 计算逻辑（函数引用）
  calculate: (answers: Record<string, number | string>) => {
    score: number;
    maxScore: number;
    details?: Record<string, any>;
  };
}

/** 协议类型 */
export type ProtocolType = 'pain' | 'rehab' | 'postop' | 'neuro';

/** 治疗协议接口 */
export interface Protocol {
  id: string;
  name: string;
  type: ProtocolType;
  version: string;
  source: string;
  lastUpdated: string;
  description: string;
  indications: string[];
  contraindications: string[];
  phases: ProtocolPhase[];
}

export interface ProtocolPhase {
  name: string;
  duration: string;
  goals: string[];
  interventions: string[];
  criteria: string[];
}

// ========== 数据验证器 ==========

export interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

export class DataValidator {
  private static errors: ValidationError[] = [];

  /** 验证单个量表 */
  static validateScale(scale: Scale): ValidationError[] {
    this.errors = [];
    
    // 1. 必要字段检查
    this.required(scale, 'id', '量表必须有唯一标识');
    this.required(scale, 'name', '量表必须有名称');
    this.required(scale, 'totalScore', '量表必须定义总分');
    this.required(scale, 'interpretation', '量表必须有分级标准');
    this.required(scale, 'calculate', '量表必须有计算函数');
    this.required(scale, 'version', '量表必须有版本号');
    this.required(scale, 'source', '量表必须注明临床来源');
    
    if (this.errors.length > 0) return this.errors;
    
    // 2. 一致性检查
    const totalScore = scale.totalScore;
    const maxInterpretScore = Math.max(...scale.interpretation.map(i => i.max));
    
    if (maxInterpretScore > totalScore) {
      this.errors.push({
        field: 'interpretation',
        message: `分级标准的最大值(${maxInterpretScore})超过了量表总分(${totalScore})`,
        severity: 'error'
      });
    }
    
    // 3. 分级连续性检查
    const sortedInterp = [...scale.interpretation].sort((a, b) => a.min - b.min);
    for (let i = 1; i < sortedInterp.length; i++) {
      const prev = sortedInterp[i - 1];
      const curr = sortedInterp[i];
      if (curr.min > prev.max + 1) {
        this.errors.push({
          field: 'interpretation',
          message: `分级区间存在空隙: ${prev.max}-${curr.min}`,
          severity: 'warning'
        });
      }
      if (curr.min <= prev.max) {
        this.errors.push({
          field: 'interpretation',
          message: `分级区间存在重叠: ${prev.max}-${curr.min}`,
          severity: 'warning'
        });
      }
    }
    
    // 4. calculate 函数返回值检查
    try {
      const testAnswers = this.generateTestAnswers(scale);
      const result = scale.calculate(testAnswers);
      
      if (typeof result !== 'object' || result === null) {
        this.errors.push({
          field: 'calculate',
          message: 'calculate 函数必须返回对象',
          severity: 'error'
        });
      } else {
        if (typeof result.score !== 'number') {
          this.errors.push({
            field: 'calculate',
            message: 'calculate 返回值必须包含 score (number)',
            severity: 'error'
          });
        }
        if (typeof result.maxScore !== 'number') {
          this.errors.push({
            field: 'calculate',
            message: 'calculate 返回值必须包含 maxScore (number)',
            severity: 'error'
          });
        }
        if (result.maxScore !== totalScore && scale.id !== 'custom') {
          this.errors.push({
            field: 'calculate',
            message: `calculate 返回的 maxScore(${result.maxScore}) 与量表定义的 totalScore(${totalScore}) 不一致`,
            severity: 'warning'
          });
        }
      }
    } catch (err) {
      this.errors.push({
        field: 'calculate',
        message: `calculate 函数执行出错: ${(err as Error).message}`,
        severity: 'error'
      });
    }
    
    return this.errors;
  }

  /** 验证单个协议 */
  static validateProtocol(protocol: Protocol): ValidationError[] {
    this.errors = [];
    
    this.required(protocol, 'id', '协议必须有唯一标识');
    this.required(protocol, 'name', '协议必须有名称');
    this.required(protocol, 'type', '协议必须有类型');
    this.required(protocol, 'version', '协议必须有版本号');
    this.required(protocol, 'phases', '协议必须包含分期');
    
    if (this.errors.length > 0) return this.errors;
    
    if (!Array.isArray(protocol.phases) || protocol.phases.length === 0) {
      this.errors.push({
        field: 'phases',
        message: '协议至少需要一个分期',
        severity: 'error'
      });
    }
    
    return this.errors;
  }

  /** 批量验证所有量表 */
  static validateAllScales(scales: Scale[]): { 
    valid: Scale[]; 
    invalid: { scale: Scale; errors: ValidationError[] }[];
    summary: { total: number; valid: number; invalid: number; warnings: number };
  } {
    const valid: Scale[] = [];
    const invalid: { scale: Scale; errors: ValidationError[] }[] = [];
    let totalWarnings = 0;
    
    for (const scale of scales) {
      const errors = this.validateScale(scale);
      const hasErrors = errors.some(e => e.severity === 'error');
      const warningCount = errors.filter(e => e.severity === 'warning').length;
      totalWarnings += warningCount;
      
      if (hasErrors) {
        invalid.push({ scale, errors });
      } else {
        valid.push(scale);
      }
    }
    
    return {
      valid,
      invalid,
      summary: {
        total: scales.length,
        valid: valid.length,
        invalid: invalid.length,
        warnings: totalWarnings
      }
    };
  }

  /** 生成测试答案 */
  private static generateTestAnswers(scale: Scale): Record<string, number | string> {
    const answers: Record<string, number | string> = {};
    
    if (scale.questions && scale.questions.length > 0) {
      for (const q of scale.questions) {
        if (q.options && q.options.length > 0) {
          answers[q.id] = q.options[0].value;
        } else if (q.min !== undefined && q.max !== undefined) {
          answers[q.id] = (q.min + q.max) / 2;
        } else {
          answers[q.id] = 0;
        }
      }
    } else {
      // 简单量表：生成默认值
      answers['q0'] = 0;
      answers[0] = 0; // 兼容数组索引访问
    }
    
    return answers;
  }

  /** 检查必要字段 */
  private static required(obj: any, field: string, message: string): void {
    const val = obj[field];
    if (val === undefined || val === null || val === '') {
      this.errors.push({
        field,
        message,
        severity: 'error'
      });
    } else if (Array.isArray(val) && val.length === 0) {
      this.errors.push({
        field,
        message: `${message}（数组不能为空）`,
        severity: 'error'
      });
    }
  }

  /** 获取当前错误列表 */
  static getErrors(): ValidationError[] {
    return [...this.errors];
  }
}

// ========== 数据工厂 ==========

/** 创建安全的量表实例 */
export function createScale(config: Partial<Scale> & Pick<Scale, 'id' | 'name' | 'totalScore' | 'calculate'>): Scale {
  const scale: Scale = {
    ...config,
    version: config.version || '1.0.0',
    source: config.source || '未指定临床来源',
    lastUpdated: config.lastUpdated || new Date().toISOString().split('T')[0],
    interpretation: config.interpretation || [],
  } as Scale;
  
  // 验证
  const errors = DataValidator.validateScale(scale);
  const hasErrors = errors.some(e => e.severity === 'error');
  
  if (hasErrors) {
    console.error('[ScaleFactory] 创建量表失败，存在以下错误:', errors);
    throw new Error(`量表 "${config.name}" 创建失败: ${errors.filter(e => e.severity === 'error').map(e => e.message).join(', ')}`);
  }
  
  if (errors.length > 0) {
    console.warn('[ScaleFactory] 量表创建成功，但存在警告:', errors);
  }
  
  return scale;
}

/** 创建安全的协议实例 */
export function createProtocol(config: Partial<Protocol> & Pick<Protocol, 'id' | 'name' | 'type'>): Protocol {
  const protocol: Protocol = {
    ...config,
    version: config.version || '1.0.0',
    source: config.source || '未指定临床来源',
    lastUpdated: config.lastUpdated || new Date().toISOString().split('T')[0],
    indications: config.indications || [],
    contraindications: config.contraindications || [],
    phases: config.phases || [],
  } as Protocol;
  
  const errors = DataValidator.validateProtocol(protocol);
  const hasErrors = errors.some(e => e.severity === 'error');
  
  if (hasErrors) {
    console.error('[ProtocolFactory] 创建协议失败，存在以下错误:', errors);
    throw new Error(`协议 "${config.name}" 创建失败: ${errors.filter(e => e.severity === 'error').map(e => e.message).join(', ')}`);
  }
  
  return protocol;
}

// ========== 自检测试 ==========

/** 运行完整的数据自检 */
export function runSelfCheck(scales: Scale[], protocols: Protocol[]): {
  status: 'healthy' | 'degraded' | 'unhealthy';
  scaleResults: ReturnType<typeof DataValidator.validateAllScales>;
  protocolResults: { errors: ValidationError[]; valid: number; invalid: number };
  timestamp: string;
} {
  console.group('🔍 [Clinical Data Self-Check]');
  
  // 1. 验证量表
  const scaleResults = DataValidator.validateAllScales(scales);
  console.log(`量表检查: ${scaleResults.summary.valid}/${scaleResults.summary.total} 通过`, 
    scaleResults.summary.invalid > 0 ? `(${scaleResults.summary.invalid} 失败)` : '');
  
  // 2. 验证协议
  let validCount = 0;
  let invalidCount = 0;
  const protocolErrors: ValidationError[] = [];
  
  for (const p of protocols) {
    const errors = DataValidator.validateProtocol(p);
    if (errors.length > 0) {
      invalidCount++;
      protocolErrors.push(...errors);
      console.warn(`❌ 协议 "${p.name}" 验证失败:`, errors);
    } else {
      validCount++;
    }
  }
  console.log(`协议检查: ${validCount}/${protocols.length} 通过`);
  
  // 3. 综合状态
  const hasErrors = scaleResults.invalid.length > 0 || invalidCount > 0;
  const hasWarnings = scaleResults.summary.warnings > 0 || protocolErrors.some(e => e.severity === 'warning');
  
  let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
  if (hasErrors) status = 'unhealthy';
  else if (hasWarnings) status = 'degraded';
  
  console.log(`状态: ${status === 'healthy' ? '✅ 健康' : status === 'degraded' ? '⚠️ 降级（有警告）' : '❌ 异常（有错误）'}`);
  console.groupEnd();
  
  return {
    status,
    scaleResults,
    protocolResults: { errors: protocolErrors, valid: validCount, invalid: invalidCount },
    timestamp: new Date().toISOString()
  };
}
