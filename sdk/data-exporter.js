/**
 * ═══════════════════════════════════════════════════════════════
 *  肌骨康复速查 V5.0 — 数据导出模块
 *  独立可复用函数，供 Node.js 后端 / AI 训练 / 数据分析使用
 * ═══════════════════════════════════════════════════════════════
 *
 *  用法：
 *    const exporter = require('./sdk/data-exporter.js');
 *
 *    // 1. 加载所有数据（自动定位项目根目录）
 *    const data = exporter.loadAll();
 *
 *    // 2. 导出概要 JSON
 *    const summary = exporter.exportSummary(data);
 *
 *    // 3. 写入文件
 *    exporter.writeToFile(summary, 'output.json');
 *
 *    // 4. 也可单独使用筛选/评分函数
 *    const pain = exporter.filterScales(data.scales, 'pain', '');
 *    const result = exporter.calculateScore(data.scales[0], [3, 2, 1]);
 *    const interp = exporter.getInterpretation(result.score, result.maxScore, scale.interpretation);
 */

const fs = require('fs');
const path = require('path');

// ═══════════════════════════════════════════════════════════════
//  1. 数据加载
// ═══════════════════════════════════════════════════════════════

/**
 * 加载所有康复数据
 * @param {Object} options
 * @param {string} [options.baseDir] - 项目根目录（默认自动定位：本文件上级目录）
 * @param {string[]} [options.include] - 要加载的数据集，默认全部
 *   可选值：'scales' / 'protocols' / 'tools' / 'guidelines' / 'muscles' / 'diseases'
 * @returns {Object} 统一数据对象
 */
function loadAll(options) {
  options = options || {};
  const baseDir = options.baseDir || path.join(__dirname, '..');
  const include = options.include || ['scales', 'protocols', 'tools', 'guidelines'];

  // 模拟浏览器全局对象，数据文件用 window.xxx 挂载
  const sandbox = { window: {} };
  global.window = sandbox.window;

  const result = {
    scales: [],
    protocols: [],
    tools: [],
    guidelines: [],
    muscles: [],
    diseases: [],
    scaleCategoryInfo: {},
    diseaseScaleMap: {},
    meta: { loadTime: new Date().toISOString(), baseDir: baseDir }
  };

  // 内部：eval 数据文件，将其挂载的 window.xxx 取回
  function loadFile(relPath) {
    const fullPath = path.join(baseDir, relPath);
    if (!fs.existsSync(fullPath)) {
      throw new Error('数据文件不存在: ' + fullPath);
    }
    const code = fs.readFileSync(fullPath, 'utf-8');
    // 数据文件中执行 window.xxx = [...]，会写入 sandbox.window
    eval(code);
  }

  try {
    if (include.indexOf('scales') >= 0) {
      loadFile('src/scales.js');
      loadFile('src/scales-extra.js');
      // 尝试加载 PRO 量表（可选）
      try { loadFile('src/scales-pro.js'); } catch (e) {}
      result.scales = (sandbox.window.assessmentScales || []).concat(sandbox.window.scalesExtra || []);
      if (sandbox.window.scalesPro) result.scales = result.scales.concat(sandbox.window.scalesPro);
      result.scaleCategoryInfo = sandbox.window.scaleCategoryInfo || {};
    }

    if (include.indexOf('protocols') >= 0) {
      loadFile('src/rehab-protocols.js');
      result.protocols = sandbox.window.rehabProtocols || [];
      // 尝试加载疼痛方案和 PRO 方案（可选）
      try { loadFile('src/pain-protocols.js'); result.protocols = result.protocols.concat(sandbox.window.painProtocols || []); } catch (e) {}
      try { loadFile('src/protocols-pro.js'); result.protocols = result.protocols.concat(sandbox.window.protocolsPro || []); } catch (e) {}
    }

    if (include.indexOf('tools') >= 0) {
      loadFile('src/clinical-tools.js');
      result.tools = sandbox.window.clinicalTools || [];
    }

    if (include.indexOf('guidelines') >= 0) {
      loadFile('src/knowledge-base.js');
      result.guidelines = sandbox.window.clinicalGuidelines || [];
      result.diseaseScaleMap = sandbox.window.diseaseScaleMap || {};
    }

    if (include.indexOf('muscles') >= 0 || include.indexOf('diseases') >= 0) {
      // data.js 较大（7.2MB），用 const 声明，需特殊处理
      const dataPath = path.join(baseDir, 'data.js');
      if (fs.existsSync(dataPath)) {
        const code = fs.readFileSync(dataPath, 'utf-8');
        // 将 const muscles = [...] 转为 window.muscles = [...]
        const transformed = code
          .replace(/^const\s+muscels\s*=/m, 'window.muscles =')
          .replace(/^const\s+muscles\s*=/m, 'window.muscles =')
          .replace(/^const\s+diseases\s*=/m, 'window.diseases =')
          .replace(/^const\s+muscleBodyParts\s*=/m, 'window.muscleBodyParts =')
          .replace(/^const\s+diseaseBodyParts\s*=/m, 'window.diseaseBodyParts =');
        eval(transformed);
        result.muscles = sandbox.window.muscles || [];
        result.diseases = sandbox.window.diseases || [];
      }
    }
  } finally {
    // 恢复全局环境
    delete global.window;
  }

  result.meta.loaded = {
    scales: result.scales.length,
    protocols: result.protocols.length,
    tools: result.tools.length,
    guidelines: result.guidelines.length,
    muscles: result.muscles.length,
    diseases: result.diseases.length
  };

  return result;
}

// ═══════════════════════════════════════════════════════════════
//  2. 筛选与评分函数（纯函数，无副作用）
// ═══════════════════════════════════════════════════════════════

/**
 * 筛选量表
 * @param {Array} scales - 量表数组
 * @param {string} category - 分类（'pain'/'balance' 等，空字符串或 '全部' 表示不限）
 * @param {string} keyword - 关键词（在 name/shortName/description 中搜索）
 * @returns {Array} 匹配的量表数组
 */
function filterScales(scales, category, keyword) {
  const kw = (keyword || '').trim().toLowerCase();
  const input = scales || [];
  return input.filter(s => {
    const catMatch = !category || category === '全部' || s.category === category;
    let searchMatch = !kw;
    if (kw) {
      if (s.name && s.name.toLowerCase().includes(kw)) searchMatch = true;
      if (s.shortName && s.shortName.toLowerCase().includes(kw)) searchMatch = true;
      if (s.description && s.description.toLowerCase().includes(kw)) searchMatch = true;
    }
    return catMatch && searchMatch;
  });
}

/**
 * 筛选康复方案
 * @param {Array} protocols - 方案数组
 * @param {string} category - 分类，支持 category(PT/OT/ST/疼痛) 或 categoryName(肩关节 等)
 * @param {string} keyword - 关键词（在 name/description/categoryName 中搜索）
 */
function filterProtocols(protocols, category, keyword) {
  const kw = (keyword || '').trim().toLowerCase();
  const input = protocols || [];
  return input.filter(p => {
    const catMatch = !category || category === '全部' ||
      p.category === category || p.categoryName === category;
    let searchMatch = !kw;
    if (kw) {
      if (p.name && p.name.toLowerCase().includes(kw)) searchMatch = true;
      if (p.description && p.description.toLowerCase().includes(kw)) searchMatch = true;
      if (p.categoryName && p.categoryName.toLowerCase().includes(kw)) searchMatch = true;
    }
    return catMatch && searchMatch;
  });
}

/**
 * 推断量表满分（当 totalScore 缺失时从 questions 推断）
 * 规则：每题满分 = options 数 - 1（Berg 5 选项 → 4 分/题）
 */
function inferMaxScore(scale) {
  if (scale.totalScore) return scale.totalScore;
  if (scale.questions && scale.questions.length > 0) {
    return scale.questions.reduce((sum, q) => {
      // 优先用 scores 数组的最大值，否则用 options 数 - 1
      if (q.scores && q.scores.length > 0) {
        return sum + Math.max.apply(null, q.scores);
      }
      if (q.options && q.options.length > 0) {
        return sum + (q.options.length - 1);
      }
      return sum;
    }, 0);
  }
  if (scale.type === 'slider') return scale.totalScore || 10;
  return scale.totalScore || 0;
}

/**
 * 计算量表得分
 * @param {Object} scale - 量表对象
 * @param {Array<number>} answers - 每题得分数组
 * @returns {Object} { score, maxScore, answers }
 */
function calculateScore(scale, answers) {
  if (!scale) return { score: 0, maxScore: 0, answers: [] };
  const ans = answers || [];
  const maxScore = inferMaxScore(scale);
  // 量表内置 calculate 函数优先
  if (typeof scale.calculate === 'function') {
    const r = scale.calculate(ans);
    return { score: r.score, maxScore: r.maxScore || maxScore, answers: ans };
  }
  // 默认累加
  const score = ans.reduce((a, b) => a + (Number(b) || 0), 0);
  return { score: score, maxScore: maxScore, answers: ans };
}

/**
 * 根据得分获取结果解读
 * @param {number} score - 得分
 * @param {number} maxScore - 满分
 * @param {Array} interpretations - 解读数组 [{min, max, level, color, desc}]
 * @returns {Object} { level, color, desc }
 */
function getInterpretation(score, maxScore, interpretations) {
  if (!interpretations || interpretations.length === 0) {
    return { level: '未知', color: 'other', desc: '' };
  }
  const sorted = [...interpretations].sort((a, b) => (a.min || 0) - (b.min || 0));
  for (let i = sorted.length - 1; i >= 0; i--) {
    if (score >= (sorted[i].min || 0)) return sorted[i];
  }
  return sorted[0];
}

// ═══════════════════════════════════════════════════════════════
//  3. 数据导出函数
// ═══════════════════════════════════════════════════════════════

/**
 * 导出数据概要（轻量，适合索引/列表展示）
 * @param {Object} data - loadAll() 返回的数据对象
 * @returns {Object} 概要 JSON
 */
function exportSummary(data) {
  return {
    exportTime: new Date().toISOString(),
    source: '肌骨康复速查 V5.0',
    summary: data.meta.loaded,
    scales: (data.scales || []).map(s => ({
      id: s.id,
      name: s.name,
      shortName: s.shortName,
      category: s.category,
      categoryName: (data.scaleCategoryInfo[s.category] || {}).name || s.category,
      totalScore: s.totalScore,
      type: s.type,
      questionCount: s.questions ? s.questions.length : (s.type === 'slider' ? 1 : 0),
      interpretationLevels: (s.interpretation || []).map(i => i.level)
    })),
    protocols: (data.protocols || []).map(p => ({
      id: p.id,
      name: p.name,
      category: p.category,
      categoryName: p.categoryName,
      stageCount: (p.stages || []).length
    })),
    tools: (data.tools || []).map(t => ({
      id: t.id,
      name: t.name,
      category: t.category,
      type: t.type
    })),
    guidelines: (data.guidelines || []).map(g => ({
      id: g.id,
      title: g.title,
      source: g.source,
      year: g.year,
      recommendationCount: (g.recommendations || []).length
    }))
  };
}

/**
 * 导出完整数据（含题目、选项、解读、方案阶段详情）
 * @param {Object} data - loadAll() 返回的数据对象
 * @returns {Object} 完整 JSON
 */
function exportFull(data) {
  return {
    exportTime: new Date().toISOString(),
    source: '肌骨康复速查 V5.0',
    summary: data.meta.loaded,
    scaleCategoryInfo: data.scaleCategoryInfo,
    scales: data.scales || [],
    protocols: data.protocols || [],
    tools: data.tools || [],
    guidelines: data.guidelines || [],
    diseaseScaleMap: data.diseaseScaleMap
  };
}

/**
 * 仅导出量表数据
 * @param {Object} data - loadAll() 返回的数据对象
 * @param {Object} [options]
 * @param {string} [options.category] - 按分类筛选
 * @param {string} [options.keyword] - 关键词筛选
 * @param {boolean} [options.full] - true 返回完整量表，false 返回概要
 */
function exportScales(data, options) {
  options = options || {};
  let scales = data.scales || [];
  if (options.category || options.keyword) {
    scales = filterScales(scales, options.category, options.keyword);
  }
  return {
    exportTime: new Date().toISOString(),
    count: scales.length,
    filter: { category: options.category || '全部', keyword: options.keyword || '' },
    scales: options.full ? scales : scales.map(s => ({
      id: s.id,
      name: s.name,
      shortName: s.shortName,
      category: s.category,
      totalScore: s.totalScore,
      type: s.type,
      questionCount: s.questions ? s.questions.length : (s.type === 'slider' ? 1 : 0),
      interpretationLevels: (s.interpretation || []).map(i => i.level)
    }))
  };
}

/**
 * 仅导出康复方案数据
 * @param {Object} data - loadAll() 返回的数据对象
 * @param {Object} [options]
 * @param {string} [options.category] - 按分类筛选
 * @param {string} [options.keyword] - 关键词筛选
 */
function exportProtocols(data, options) {
  options = options || {};
  let protocols = data.protocols || [];
  if (options.category || options.keyword) {
    protocols = filterProtocols(protocols, options.category, options.keyword);
  }
  return {
    exportTime: new Date().toISOString(),
    count: protocols.length,
    filter: { category: options.category || '全部', keyword: options.keyword || '' },
    protocols: protocols
  };
}

/**
 * 导出单个量表的完整信息（含模拟评分示例）
 * @param {Object} data - loadAll() 返回的数据对象
 * @param {string} scaleId - 量表 ID
 * @param {Array<number>} [mockAnswers] - 模拟作答（可选）
 */
function exportScaleDetail(data, scaleId, mockAnswers) {
  const scale = (data.scales || []).find(s => s.id === scaleId);
  if (!scale) return { error: '未找到量表: ' + scaleId };

  const result = { scale: scale };
  if (mockAnswers && mockAnswers.length > 0) {
    const scoreResult = calculateScore(scale, mockAnswers);
    const interp = getInterpretation(scoreResult.score, scoreResult.maxScore, scale.interpretation || []);
    result.mockAssessment = {
      answers: mockAnswers,
      score: scoreResult.score,
      maxScore: scoreResult.maxScore,
      level: interp.level,
      color: interp.color,
      desc: interp.desc
    };
  }
  return result;
}

// ═══════════════════════════════════════════════════════════════
//  4. 文件写入辅助
// ═══════════════════════════════════════════════════════════════

/**
 * 将数据写入 JSON 文件
 * @param {Object} data - 任意可序列化对象
 * @param {string} filePath - 输出文件路径
 * @param {boolean} [pretty] - 是否格式化，默认 true
 * @returns {string} 实际写入的绝对路径
 */
function writeToFile(data, filePath, pretty) {
  const absPath = path.isAbsolute(filePath) ? filePath : path.resolve(filePath);
  const json = pretty === false ? JSON.stringify(data) : JSON.stringify(data, null, 2);
  fs.writeFileSync(absPath, json, 'utf-8');
  return absPath;
}

// ═══════════════════════════════════════════════════════════════
//  5. 导出模块
// ═══════════════════════════════════════════════════════════════

module.exports = {
  // 数据加载
  loadAll: loadAll,

  // 筛选函数（纯函数）
  filterScales: filterScales,
  filterProtocols: filterProtocols,

  // 评分函数（纯函数）
  calculateScore: calculateScore,
  getInterpretation: getInterpretation,

  // 导出函数
  exportSummary: exportSummary,
  exportFull: exportFull,
  exportScales: exportScales,
  exportProtocols: exportProtocols,
  exportScaleDetail: exportScaleDetail,

  // 文件写入
  writeToFile: writeToFile
};
