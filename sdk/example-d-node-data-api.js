/**
 * Node.js 数据访问示例（使用封装后的 data-exporter 模块）
 *
 * 运行方式：
 *   node sdk/example-d-node-data-api.js
 *
 * 说明：
 *   本示例演示如何使用 data-exporter.js 封装函数。
 *   如需查看底层实现，请看 sdk/data-exporter.js。
 */

const exporter = require('./data-exporter.js');

console.log('='.repeat(60));
console.log('肌骨康复速查 V5.0 — Node.js 数据访问示例');
console.log('='.repeat(60));

// 1. 加载所有数据（一行搞定）
console.log('\n[1] 加载所有数据...');
const data = exporter.loadAll();
console.log('  量表:', data.scales.length, '个');
console.log('  康复方案:', data.protocols.length, '套');
console.log('  临床工具:', data.tools.length, '个');
console.log('  临床指南:', data.guidelines.length, '条');

// 2. 筛选疼痛类量表
console.log('\n[2] 筛选疼痛类量表:');
const painScales = exporter.filterScales(data.scales, 'pain', '');
painScales.forEach(s => {
  console.log('  - ' + s.name + ' (满分 ' + s.totalScore + ')');
});

// 3. 搜索量表
console.log('\n[3] 搜索 "berg" 量表:');
const bergResults = exporter.filterScales(data.scales, '全部', 'berg');
bergResults.forEach(s => {
  console.log('  - ' + s.name + ' [id=' + s.id + ']');
});

// 4. 模拟 VAS 评分
console.log('\n[4] 模拟 VAS 评分:');
const vasDetail = exporter.exportScaleDetail(data, 'vas', [7]);
console.log('  量表:', vasDetail.scale.name);
console.log('  得分:', vasDetail.mockAssessment.score + '/' + vasDetail.mockAssessment.maxScore);
console.log('  等级:', vasDetail.mockAssessment.level);
console.log('  解读:', vasDetail.mockAssessment.desc);

// 5. 模拟 Berg 平衡量表评分
console.log('\n[5] 模拟 Berg 平衡量表评分:');
const berg = data.scales.find(s => s.id === 'berg-balance' || s.shortName === 'BBS');
if (berg) {
  const mockAnswers = new Array(berg.questions ? berg.questions.length : 14).fill(3);
  const bergDetail = exporter.exportScaleDetail(data, berg.id, mockAnswers);
  console.log('  量表:', bergDetail.scale.name);
  console.log('  题目数:', berg.questions ? berg.questions.length : 'N/A');
  console.log('  得分:', bergDetail.mockAssessment.score + '/' + bergDetail.mockAssessment.maxScore);
  console.log('  等级:', bergDetail.mockAssessment.level);
}

// 6. 导出概要 JSON 到文件
console.log('\n[6] 导出概要 JSON:');
const summary = exporter.exportSummary(data);
const summaryPath = exporter.writeToFile(summary, 'exported-data.json');
console.log('  路径:', summaryPath);
console.log('  量表:', summary.scales.length, '条');
console.log('  方案:', summary.protocols.length, '条');

// 7. 导出完整量表数据（含题目和选项）
console.log('\n[7] 导出疼痛类完整量表数据:');
const painFull = exporter.exportScales(data, { category: 'pain', full: true });
const painPath = exporter.writeToFile(painFull, 'exported-pain-scales.json');
console.log('  路径:', painPath);
console.log('  量表数:', painFull.count);

// 8. 导出康复方案（按关键词搜索"肩"）
console.log('\n[8] 导出肩部相关康复方案:');
const shoulderProtos = exporter.exportProtocols(data, { keyword: '肩' });
console.log('  方案数:', shoulderProtos.count);
shoulderProtos.protocols.forEach(p => {
  console.log('  - ' + p.name + ' (' + p.stages.length + ' 阶段)');
});

console.log('\n' + '='.repeat(60));
console.log('示例运行完成');
console.log('  - exported-data.json        概要数据');
console.log('  - exported-pain-scales.json 疼痛类完整量表');
console.log('='.repeat(60));
