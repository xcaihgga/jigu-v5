/**
 * Node.js 纯数据访问示例
 * 适用：后端服务、爬虫、AI 训练数据准备等场景
 *
 * 运行方式：
 *   node sdk/example-d-node-data-api.js
 *
 * 说明：
 *   数据文件原本是为浏览器设计的（用 window.xxx 挂载），
 *   在 Node.js 中需要模拟 window 对象后 eval。
 */

const fs = require('fs');
const path = require('path');

// 模拟浏览器全局对象
global.window = global;

// 工具函数（从 utils.js 提取核心逻辑，避免引入 DOM 相关代码）
function escapeHtml(val) {
  if (val === null || val === undefined) return '';
  return String(val).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function getInterpretation(score, maxScore, interpretations) {
  const sorted = [...interpretations].sort((a, b) => a.min - b.min);
  for (let i = sorted.length - 1; i >= 0; i--) {
    if (score >= sorted[i].min) return sorted[i];
  }
  return sorted[0] || { level: '未知', color: 'other', desc: '' };
}

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

// 加载数据文件（在 Node.js 中 eval，使其挂载到 global）
function loadDataFile(relativePath) {
  const fullPath = path.join(__dirname, '..', relativePath);
  const content = fs.readFileSync(fullPath, 'utf-8');
  eval(content);
}

console.log('='.repeat(60));
console.log('肌骨康复速查 V5.0 — Node.js 数据访问示例');
console.log('='.repeat(60));

// 1. 加载量表数据
console.log('\n[1] 加载量表数据...');
loadDataFile('src/scales.js');
loadDataFile('src/scales-extra.js');
console.log('  核心量表:', assessmentScales.length, '个');
console.log('  扩展量表:', scalesExtra.length, '个');
console.log('  合计:', assessmentScales.length + scalesExtra.length, '个');

// 2. 加载康复方案
console.log('\n[2] 加载康复方案...');
loadDataFile('src/rehab-protocols.js');
console.log('  康复方案:', rehabProtocols.length, '套');

// 3. 加载临床工具
console.log('\n[3] 加载临床工具...');
loadDataFile('src/clinical-tools.js');
console.log('  临床工具:', clinicalTools.length, '个');

// 4. 加载指南
console.log('\n[4] 加载临床指南...');
loadDataFile('src/knowledge-base.js');
console.log('  临床指南:', clinicalGuidelines.length, '条');

// 5. 示例：筛选疼痛类量表
console.log('\n[5] 筛选疼痛类量表:');
const allScales = assessmentScales.concat(scalesExtra);
const painScales = filterScales(allScales, 'pain', '');
painScales.forEach(s => {
  console.log('  - ' + s.name + ' (满分 ' + s.totalScore + ')');
});

// 6. 示例：搜索量表
console.log('\n[6] 搜索 "berg" 量表:');
const bergResults = filterScales(allScales, '全部', 'berg');
bergResults.forEach(s => {
  console.log('  - ' + s.name + ' [id=' + s.id + ']');
});

// 7. 示例：模拟评分
console.log('\n[7] 模拟 VAS 评分:');
const vas = allScales.find(s => s.id === 'vas');
if (vas) {
  const mockScore = 7;
  const result = vas.calculate ? vas.calculate([mockScore]) : { score: mockScore, maxScore: vas.totalScore };
  const interp = getInterpretation(result.score, result.maxScore, vas.interpretation || []);
  console.log('  量表:', vas.name);
  console.log('  模拟得分:', result.score + '/' + result.maxScore);
  console.log('  等级:', interp.level);
  console.log('  解读:', interp.desc);
}

// 8. 示例：Berg 平衡量表评分
console.log('\n[8] 模拟 Berg 平衡量表评分:');
const berg = allScales.find(s => s.id === 'berg-balance' || s.shortName === 'BBS');
if (berg) {
  // 模拟 14 题，每题取 3 分（满分 4 分）
  const mockAnswers = new Array(berg.questions ? berg.questions.length : 14).fill(3);
  const result = berg.calculate ? berg.calculate(mockAnswers) : { score: mockAnswers.reduce((a,b)=>a+b,0), maxScore: berg.totalScore };
  const interp = getInterpretation(result.score, result.maxScore, berg.interpretation || []);
  console.log('  量表:', berg.name);
  console.log('  题目数:', berg.questions ? berg.questions.length : 'N/A');
  console.log('  模拟作答:', mockAnswers.join(','));
  console.log('  得分:', result.score + '/' + result.maxScore);
  console.log('  等级:', interp.level);
  console.log('  解读:', interp.desc);
} else {
  console.log('  未找到 Berg 平衡量表');
}

// 9. 示例：输出康复方案阶段
console.log('\n[9] 康复方案阶段示例:');
if (rehabProtocols.length > 0) {
  const proto = rehabProtocols[0];
  console.log('  方案:', proto.name);
  console.log('  阶段数:', proto.stages.length);
  proto.stages.forEach((stage, i) => {
    console.log('  [阶段' + (i+1) + '] ' + stage.name);
    console.log('    目标:', stage.goal);
    console.log('    频率:', stage.duration);
    console.log('    动作:', (stage.exercises || []).slice(0, 2).join('; ') + '...');
    console.log('    进阶:', stage.criteria);
  });
}

// 10. 示例：导出为 JSON（供 AI 训练或其他用途）
console.log('\n[10] 导出数据为 JSON:');
const exportData = {
  exportTime: new Date().toISOString(),
  scales: allScales.map(s => ({
    id: s.id,
    name: s.name,
    shortName: s.shortName,
    category: s.category,
    totalScore: s.totalScore,
    type: s.type,
    questionCount: s.questions ? s.questions.length : (s.type === 'slider' ? 1 : 0),
    interpretationLevels: (s.interpretation || []).map(i => i.level)
  })),
  protocols: rehabProtocols.map(p => ({
    id: p.id,
    name: p.name,
    category: p.category,
    stageCount: p.stages.length
  })),
  tools: clinicalTools.map(t => ({
    id: t.id,
    name: t.name,
    category: t.category,
    type: t.type
  })),
  guidelines: clinicalGuidelines.map(g => ({
    id: g.id,
    title: g.title,
    source: g.source,
    year: g.year,
    recommendationCount: g.recommendations ? g.recommendations.length : 0
  }))
};

const jsonPath = path.join(__dirname, 'exported-data.json');
fs.writeFileSync(jsonPath, JSON.stringify(exportData, null, 2), 'utf-8');
console.log('  已导出到:', jsonPath);
console.log('  量表:', exportData.scales.length, '条');
console.log('  方案:', exportData.protocols.length, '条');
console.log('  工具:', exportData.tools.length, '条');
console.log('  指南:', exportData.guidelines.length, '条');

console.log('\n' + '='.repeat(60));
console.log('示例运行完成');
console.log('='.repeat(60));
