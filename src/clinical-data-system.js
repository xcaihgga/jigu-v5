/**
 * 临床数据验证与迁移系统 v1.0
 * 
 * 功能：
 * 1. 验证现有临床数据的完整性、一致性和自洽性
 * 2. 自动迁移数据到新架构，补充版本/来源元数据
 * 3. 生成详细的验证报告
 * 4. 供 UI 层调用显示数据版本信息
 */

// ========== 数据验证器 ==========

class DataValidator {
  /**
   * 验证单个量表
   * @param {Object} scale - 量表对象
   * @returns {Array} - 错误列表 [{field, message, severity}]
   */
  static validateScale(scale) {
    const errors = [];
    
    // 1. 必要字段检查
    if (!scale.id || typeof scale.id !== 'string') {
      errors.push({ field: 'id', message: '量表必须有唯一标识 (string)', severity: 'error' });
    }
    if (!scale.name || typeof scale.name !== 'string') {
      errors.push({ field: 'name', message: '量表必须有名称', severity: 'error' });
    }
    if (scale.totalScore === undefined || scale.totalScore === null) {
      errors.push({ field: 'totalScore', message: '量表必须定义总分', severity: 'error' });
    }
    if (!Array.isArray(scale.interpretation) || scale.interpretation.length === 0) {
      errors.push({ field: 'interpretation', message: '量表必须有分级标准', severity: 'error' });
    }
    if (typeof scale.calculate !== 'function') {
      errors.push({ field: 'calculate', message: '量表必须有计算函数', severity: 'error' });
    }
    
    if (errors.length > 0) return errors;
    
    // 2. 一致性检查：分级标准的最大值不能超过总分
    const maxInterpretScore = Math.max(...scale.interpretation.map(i => i.max));
    if (maxInterpretScore > scale.totalScore) {
      errors.push({
        field: 'interpretation',
        message: `分级标准的最大值(${maxInterpretScore})超过了量表总分(${scale.totalScore})`,
        severity: 'error'
      });
    }
    
    // 3. 分级连续性检查
    const sortedInterp = [...scale.interpretation].sort((a, b) => a.min - b.min);
    for (let i = 1; i < sortedInterp.length; i++) {
      const prev = sortedInterp[i - 1];
      const curr = sortedInterp[i];
      if (curr.min > prev.max + 1) {
        errors.push({
          field: 'interpretation',
          message: `分级区间存在空隙: ${prev.max} → ${curr.min} (等级: ${prev.level} → ${curr.level})`,
          severity: 'warning'
        });
      }
      if (curr.min <= prev.max && curr.max >= prev.min) {
        // 只有明显重叠才警告
        if (curr.min < prev.max) {
          errors.push({
            field: 'interpretation',
            message: `分级区间存在重叠: ${prev.level}(${prev.min}-${prev.max}) 与 ${curr.level}(${curr.min}-${curr.max})`,
            severity: 'warning'
          });
        }
      }
    }
    
    // 4. calculate 函数返回值检查
    try {
      const testAnswers = this._generateTestAnswers(scale);
      const result = scale.calculate(testAnswers);
      
      if (typeof result !== 'object' || result === null) {
        errors.push({ field: 'calculate', message: 'calculate 函数必须返回对象', severity: 'error' });
      } else {
        if (typeof result.score !== 'number') {
          errors.push({ field: 'calculate', message: 'calculate 返回值必须包含 score (number)', severity: 'error' });
        }
        if (typeof result.maxScore !== 'number') {
          errors.push({ field: 'calculate', message: 'calculate 返回值必须包含 maxScore (number)', severity: 'error' });
        }
        if (result.maxScore !== scale.totalScore && !scale.id.startsWith('custom_')) {
          errors.push({
            field: 'calculate',
            message: `calculate 返回的 maxScore(${result.maxScore}) 与量表定义的 totalScore(${scale.totalScore}) 不一致`,
            severity: 'warning'
          });
        }
      }
    } catch (err) {
      errors.push({
        field: 'calculate',
        message: `calculate 函数执行出错: ${err.message}`,
        severity: 'error'
      });
    }
    
    return errors;
  }
  
  /**
   * 验证单个协议
   * @param {Object} protocol - 协议对象
   * @returns {Array} - 错误列表
   */
  static validateProtocol(protocol) {
    const errors = [];
    
    if (!protocol.id) {
      errors.push({ field: 'id', message: '协议必须有唯一标识', severity: 'error' });
    }
    if (!protocol.name) {
      errors.push({ field: 'name', message: '协议必须有名称', severity: 'error' });
    }
    if (!protocol.type) {
      errors.push({ field: 'type', message: '协议必须有类型', severity: 'error' });
    }
    if (!protocol.phases || !Array.isArray(protocol.phases) || protocol.phases.length === 0) {
      errors.push({ field: 'phases', message: '协议必须包含至少一个分期', severity: 'error' });
    }
    
    return errors;
  }
  
  /**
   * 批量验证所有量表
   * @param {Array} scales - 量表数组
   * @returns {Object} - 验证结果报告
   */
  static validateAllScales(scales) {
    const valid = [];
    const invalid = [];
    let totalErrors = 0;
    let totalWarnings = 0;
    
    for (const scale of scales) {
      const errors = this.validateScale(scale);
      const hasErrors = errors.some(e => e.severity === 'error');
      const warningCount = errors.filter(e => e.severity === 'warning').length;
      
      totalWarnings += warningCount;
      
      if (hasErrors) {
        invalid.push({ scale, errors });
        totalErrors += errors.filter(e => e.severity === 'error').length;
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
        errors: totalErrors,
        warnings: totalWarnings
      }
    };
  }
  
  /**
   * 生成测试答案
   * @private
   */
  static _generateTestAnswers(scale) {
    const answers = {};
    
    // 处理有 questions 数组的量表
    if (scale.questions && Array.isArray(scale.questions) && scale.questions.length > 0) {
      scale.questions.forEach((q, idx) => {
        if (q.options && Array.isArray(q.options)) {
          // 如果有 scores 数组，使用第一个分数
          if (q.scores && Array.isArray(q.scores)) {
            answers[idx] = q.scores[0] || 0;
            answers[q.id || idx] = q.scores[0] || 0;
          } else {
            answers[idx] = 0;
            answers[q.id || idx] = 0;
          }
        } else if (q.min !== undefined && q.max !== undefined) {
          answers[idx] = (q.min + q.max) / 2;
          answers[q.id || idx] = (q.min + q.max) / 2;
        } else {
          answers[idx] = 0;
          answers[q.id || idx] = 0;
        }
      });
    } else {
      // 简单量表：默认值
      answers[0] = 0;
      answers['q0'] = 0;
    }
    
    return answers;
  }
}

// ========== 数据适配器 ==========

class DataAdapter {
  /**
   * 适配单个量表
   * @param {Object} raw - 原始量表数据
   * @returns {Object} - 适配后的量表（带有版本信息）
   */
  static adaptScale(raw) {
    const adapted = {
      ...raw,
      // 补充元数据（如果不存在）
      version: raw.version || '1.0.0',
      source: raw.source || raw.reference || '临床常规应用',
      lastUpdated: raw.lastUpdated || new Date().toISOString().split('T')[0],
      // 确保 shortName 存在
      shortName: raw.shortName || raw.id.toUpperCase(),
      // 确保 category 存在
      category: raw.category || 'uncategorized',
    };
    
    // 验证
    const errors = DataValidator.validateScale(adapted);
    const hasErrors = errors.some(e => e.severity === 'error');
    
    return { scale: adapted, errors, hasErrors };
  }
  
  /**
   * 批量适配量表
   * @param {Array} rawScales - 原始量表数组
   * @returns {Object} - 适配结果
   */
  static adaptScales(rawScales) {
    const scales = [];
    const errors = [];
    
    for (const raw of rawScales) {
      try {
        const { scale, errors: errs, hasErrors } = this.adaptScale(raw);
        if (hasErrors) {
          errors.push({ id: raw.id, name: raw.name, errors: errs });
        }
        scales.push({ scale, valid: !hasErrors, errors: errs });
      } catch (e) {
        errors.push({ id: raw.id, name: raw.name, errors: [{ field: 'creation', message: e.message, severity: 'error' }] });
      }
    }
    
    return { scales, errors };
  }
  
  /**
   * 适配协议数据
   * @param {Array} rawProtocols - 原始协议数组
   * @returns {Object} - 适配结果
   */
  static adaptProtocols(rawProtocols) {
    const protocols = [];
    const errors = [];
    
    for (const raw of rawProtocols) {
      try {
        const adapted = {
          ...raw,
          version: raw.version || '1.0.0',
          source: raw.source || '临床指南',
          lastUpdated: raw.lastUpdated || new Date().toISOString().split('T')[0],
        };
        
        const errs = DataValidator.validateProtocol(adapted);
        const hasErrors = errs.some(e => e.severity === 'error');
        
        if (hasErrors) {
          errors.push({ id: raw.id, name: raw.name, errors: errs });
        }
        protocols.push({ protocol: adapted, valid: !hasErrors, errors: errs });
      } catch (e) {
        errors.push({ id: raw.id, name: raw.name, errors: [{ field: 'creation', message: e.message, severity: 'error' }] });
      }
    }
    
    return { protocols, errors };
  }
}

// ========== 迁移报告生成器 ==========

class MigrationReporter {
  /**
   * 生成完整的迁移报告
   * @param {Object} scaleResult - 量表迁移结果
   * @param {Object} protocolResult - 协议迁移结果
   * @returns {Object} - 迁移报告
   */
  static generateReport(scaleResult, protocolResult) {
    const validScales = scaleResult.scales.filter(s => s.valid);
    const invalidScales = scaleResult.scales.filter(s => !s.valid);
    const validProtocols = protocolResult.protocols.filter(p => p.valid);
    const invalidProtocols = protocolResult.protocols.filter(p => !p.valid);
    
    // 收集版本信息
    const scaleVersions = [...new Set(validScales.map(s => s.scale.version))];
    const scaleSources = [...new Set(validScales.map(s => s.scale.source))];
    const protocolVersions = [...new Set(validProtocols.map(p => p.protocol.version))];
    const protocolSources = [...new Set(validProtocols.map(p => p.protocol.source))];
    
    return {
      timestamp: new Date().toISOString(),
      status: invalidScales.length === 0 && invalidProtocols.length === 0 ? 'healthy' : 'degraded',
      summary: {
        scales: {
          total: scaleResult.scales.length,
          valid: validScales.length,
          invalid: invalidScales.length,
          versions: scaleVersions,
          sources: scaleSources
        },
        protocols: {
          total: protocolResult.protocols.length,
          valid: validProtocols.length,
          invalid: invalidProtocols.length,
          versions: protocolVersions,
          sources: protocolSources
        }
      },
      details: {
        invalidScales: invalidScales.map(s => ({
          id: s.scale.id,
          name: s.scale.name,
          errors: s.errors
        })),
        invalidProtocols: invalidProtocols.map(p => ({
          id: p.protocol.id,
          name: p.protocol.name,
          errors: p.errors
        }))
      }
    };
  }
  
  /**
   * 将报告格式化为可读文本
   * @param {Object} report - 迁移报告
   * @returns {string} - 格式化的文本报告
   */
  static formatReport(report) {
    const lines = [];
    lines.push('╔══════════════════════════════════════════════════════════════╗');
    lines.push('║              临床数据迁移与验证报告                        ║');
    lines.push('╚══════════════════════════════════════════════════════════════╝');
    lines.push('');
    lines.push(`生成时间: ${new Date(report.timestamp).toLocaleString('zh-CN')}`);
    lines.push(`系统状态: ${report.status === 'healthy' ? '✅ 健康' : '⚠️ 降级 (存在无效数据)'}`);
    lines.push('');
    lines.push('──────────────────────────────────────────────────────────────');
    lines.push('📊 量表验证结果');
    lines.push('──────────────────────────────────────────────────────────────');
    lines.push(`  总数: ${report.summary.scales.total}`);
    lines.push(`  通过: ${report.summary.scales.valid}`);
    lines.push(`  失败: ${report.summary.scales.invalid}`);
    lines.push(`  版本: ${report.summary.scales.versions.join(', ') || '未指定'}`);
    lines.push(`  来源: ${report.summary.scales.sources.join(', ') || '未指定'}`);
    
    if (report.details.invalidScales.length > 0) {
      lines.push('');
      lines.push('  ❌ 无效量表详情:');
      for (const item of report.details.invalidScales) {
        lines.push(`    - [${item.id}] ${item.name}`);
        for (const err of item.errors) {
          lines.push(`      • [${err.severity.toUpperCase()}] ${err.field}: ${err.message}`);
        }
      }
    }
    
    lines.push('');
    lines.push('──────────────────────────────────────────────────────────────');
    lines.push('📋 协议验证结果');
    lines.push('──────────────────────────────────────────────────────────────');
    lines.push(`  总数: ${report.summary.protocols.total}`);
    lines.push(`  通过: ${report.summary.protocols.valid}`);
    lines.push(`  失败: ${report.summary.protocols.invalid}`);
    lines.push(`  版本: ${report.summary.protocols.versions.join(', ') || '未指定'}`);
    lines.push(`  来源: ${report.summary.protocols.sources.join(', ') || '未指定'}`);
    
    if (report.details.invalidProtocols.length > 0) {
      lines.push('');
      lines.push('  ❌ 无效协议详情:');
      for (const item of report.details.invalidProtocols) {
        lines.push(`    - [${item.id}] ${item.name}`);
        for (const err of item.errors) {
          lines.push(`      • [${err.severity.toUpperCase()}] ${err.field}: ${err.message}`);
        }
      }
    }
    
    lines.push('');
    lines.push('──────────────────────────────────────────────────────────────');
    lines.push('🏷️  数据版本信息');
    lines.push('──────────────────────────────────────────────────────────────');
    lines.push(`  量表版本: ${report.summary.scales.versions.join(', ') || 'N/A'}`);
    lines.push(`  协议版本: ${report.summary.protocols.versions.join(', ') || 'N/A'}`);
    lines.push(`  量表来源: ${report.summary.scales.sources.join(' | ') || 'N/A'}`);
    lines.push(`  协议来源: ${report.summary.protocols.sources.join(' | ') || 'N/A'}`);
    lines.push('');
    lines.push('╔══════════════════════════════════════════════════════════════╗');
    lines.push(`║ 总计: ${report.summary.scales.total + report.summary.protocols.total} 项数据 | 有效: ${report.summary.scales.valid + report.summary.protocols.valid} | 无效: ${report.summary.scales.invalid + report.summary.protocols.invalid}`);
    lines.push('╚══════════════════════════════════════════════════════════════╝');
    
    return lines.join('\n');
  }
}

// ========== 数据服务（供 UI 调用） ==========

class ClinicalDataService {
  constructor() {
    this._state = {
      initialized: false,
      scales: [],
      protocols: [],
      report: null,
      versionInfo: null
    };
    this._listeners = new Set();
  }
  
  /**
   * 初始化数据服务（迁移+验证）
   * @param {Array} rawScales - 原始量表数据
   * @param {Array} rawProtocols - 原始协议数据
   * @returns {Object} - 初始化结果
   */
  initialize(rawScales, rawProtocols) {
    console.log('🚀 [ClinicalDataService] 开始初始化...');
    console.time('dataInit');
    
    // 1. 适配量表
    console.log('📊 适配量表数据...');
    const scaleResult = DataAdapter.adaptScales(rawScales);
    const validScales = scaleResult.scales.filter(s => s.valid).map(s => s.scale);
    console.log(`  ✅ 通过: ${validScales.length}/${rawScales.length}`);
    
    // 2. 适配协议
    console.log('📋 适配协议数据...');
    const protocolResult = DataAdapter.adaptProtocols(rawProtocols);
    const validProtocols = protocolResult.protocols.filter(p => p.valid).map(p => p.protocol);
    console.log(`  ✅ 通过: ${validProtocols.length}/${rawProtocols.length}`);
    
    // 3. 生成报告
    console.log('📝 生成迁移报告...');
    const report = MigrationReporter.generateReport(scaleResult, protocolResult);
    
    // 4. 提取版本信息
    const versionInfo = {
      scales: {
        count: validScales.length,
        versions: [...new Set(validScales.map(s => s.version))],
        sources: [...new Set(validScales.map(s => s.source))]
      },
      protocols: {
        count: validProtocols.length,
        versions: [...new Set(validProtocols.map(p => p.version))],
        sources: [...new Set(validProtocols.map(p => p.source))]
      },
      generatedAt: report.timestamp
    };
    
    // 5. 更新状态
    this._state = {
      initialized: true,
      scales: validScales,
      protocols: validProtocols,
      report,
      versionInfo
    };
    
    console.timeEnd('dataInit');
    console.log(`📈 状态: ${report.status === 'healthy' ? '✅ 健康' : '⚠️ 降级'}`);
    console.log(`🏷️  量表版本: ${versionInfo.scales.versions.join(', ')}`);
    console.log(`🏷️  协议版本: ${versionInfo.protocols.versions.join(', ')}`);
    
    // 6. 通知监听器
    this._notify();
    
    return this._state;
  }
  
  /**
   * 获取当前状态
   */
  getState() {
    return { ...this._state };
  }
  
  /**
   * 获取所有有效量表
   */
  getScales() {
    return this._state.scales;
  }
  
  /**
   * 获取所有有效协议
   */
  getProtocols() {
    return this._state.protocols;
  }
  
  /**
   * 获取版本信息
   */
  getVersionInfo() {
    return this._state.versionInfo;
  }
  
  /**
   * 获取验证报告
   */
  getReport() {
    return this._state.report;
  }
  
  /**
   * 订阅状态变更
   * @param {Function} callback - 回调函数
   * @returns {Function} - 取消订阅函数
   */
  subscribe(callback) {
    this._listeners.add(callback);
    callback(this._state); // 立即回调一次
    return () => this._listeners.delete(callback);
  }
  
  /**
   * 通知所有监听器
   * @private
   */
  _notify() {
    this._listeners.forEach(cb => {
      try {
        cb(this._state);
      } catch (e) {
        console.error('[ClinicalDataService] 监听器错误:', e);
      }
    });
  }
}

// ========== 导出全局 API ==========

// 创建全局单例
const clinicalDataService = new ClinicalDataService();

// 挂载到 window 对象（浏览器环境）
if (typeof window !== 'undefined') {
  window.ClinicalData = {
    // 核心类
    DataValidator,
    DataAdapter,
    MigrationReporter,
    ClinicalDataService,
    
    // 单例服务
    service: clinicalDataService,
    
    // 便捷方法
    init: (scales, protocols) => clinicalDataService.initialize(scales, protocols),
    getScales: () => clinicalDataService.getScales(),
    getProtocols: () => clinicalDataService.getProtocols(),
    getVersionInfo: () => clinicalDataService.getVersionInfo(),
    getReport: () => clinicalDataService.getReport(),
    getState: () => clinicalDataService.getState(),
    subscribe: (cb) => clinicalDataService.subscribe(cb),
    
    // 独立验证工具
    validateScale: (scale) => DataValidator.validateScale(scale),
    validateProtocol: (protocol) => DataValidator.validateProtocol(protocol),
    validateAll: (scales, protocols) => {
      const scaleReport = DataValidator.validateAllScales(scales);
      const protocolErrors = protocols.map(p => ({
        protocol: p,
        errors: DataValidator.validateProtocol(p)
      }));
      return { scaleReport, protocolErrors };
    },
    
    // 报告工具
    formatReport: (report) => MigrationReporter.formatReport(report)
  };
  
  console.log('📚 临床数据系统已挂载到 window.ClinicalData');
  console.log('💡 使用方式: window.ClinicalData.init(scales, protocols)');
}

// 导出用于模块环境（如 Node.js 测试）
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    DataValidator,
    DataAdapter,
    MigrationReporter,
    ClinicalDataService,
    clinicalDataService
  };
}
