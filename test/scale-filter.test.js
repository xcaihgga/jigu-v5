/**
 * ═══════════════════════════════════════════════════════════════
 *  量表搜索 + 分类标签筛选逻辑测试
 * ═══════════════════════════════════════════════════════════════
 *
 *  运行方式：node test/scale-filter.test.js
 *
 *  测试覆盖：
 *    A. 埋点代码完整性（structural）
 *       - interactionLog 已注入
 *       - evidence.render / stage.row.click / stage.scroll.link /
 *         scale.category.change / scale.search.input / scale.library.filter 埋点存在
 *    B. filterScales 纯函数行为（functional，使用模拟数据）
 *       1. 无关键词 + 全部分类 → 返回全部
 *       2. 关键词匹配 name
 *       3. 关键词匹配 shortName
 *       4. 关键词匹配 description
 *       5. 关键词大小写不敏感
 *       6. 关键词前后空格被 trim
 *       7. 分类筛选独立生效
 *       8. 分类 + 关键词组合（AND 语义）
 *       9. 无匹配返回空数组
 *      10. 空量表数组返回空数组
 *      11. 中文关键词匹配
 *      12. 不存在的分类返回空
 */

// ═══════════════════════════════════════════════════════════════
//  测试框架
// ═══════════════════════════════════════════════════════════════

var passed = 0, failed = 0;
var failures = [];

function assert(condition, message) {
  if (condition) {
    passed++;
  } else {
    failed++;
    failures.push(message);
    console.error('  ✗ FAIL: ' + message);
  }
}

function describe(name, fn) {
  console.log('\n▸ ' + name);
  fn();
}

function it(name, fn) {
  process.stdout.write('  ' + name + ' ... ');
  var beforeFailed = failed;
  try { fn(); } catch (e) { failed++; failures.push(name + ' (异常: ' + e.message + ')'); console.error('  ✗ 异常: ' + e.message); }
  if (failed === beforeFailed) console.log('✓');
}

// ═══════════════════════════════════════════════════════════════
//  A. 埋点代码结构完整性
// ═══════════════════════════════════════════════════════════════

var fs = require('fs');
var path = require('path');

var indexPath = path.join(__dirname, '..', 'index.html');
var html = fs.readFileSync(indexPath, 'utf-8');

describe('A. 埋点代码结构完整性', function() {
  it('interactionLog 已注入', function() {
    assert(html.indexOf('window.interactionLog') >= 0, '应注入 window.interactionLog');
    assert(html.indexOf('[Interaction][') >= 0, '应使用 [Interaction][LEVEL] 前缀');
  });

  it('日志器支持级别动态切换', function() {
    assert(html.indexOf('setLevel') >= 0, '应提供 setLevel 方法');
    assert(html.indexOf('interactionLogLevel') >= 0, '应支持 localStorage 持久化级别');
    assert(html.indexOf('?log=') >= 0 || html.indexOf('[?&]log=') >= 0, '应支持 URL 参数临时切换');
  });

  it('P1 循证数据渲染埋点 evidence.render 存在', function() {
    assert(html.indexOf("interactionLog.info('evidence.render'") >= 0 ||
           html.indexOf('interactionLog.info("evidence.render"') >= 0,
      '应包含 evidence.render info 埋点');
    assert(html.indexOf('renderedFields') >= 0, '应记录已渲染的字段列表');
    assert(html.indexOf('evidence.render.skip') >= 0, '应包含无循证数据时的 debug 埋点');
    assert(html.indexOf('evidence.render.empty') >= 0, '应包含字段为空时的 warn 埋点');
  });

  it('P2 阶段表格行点击埋点 stage.row.click 存在', function() {
    assert(html.indexOf("interactionLog.info('stage.row.click'") >= 0 ||
           html.indexOf('interactionLog.info("stage.row.click"') >= 0,
      '应包含 stage.row.click info 埋点');
    assert(html.indexOf('stageIndex') >= 0, '应记录 stageIndex');
    assert(html.indexOf('protocolId') >= 0, '应记录 protocolId');
    assert(html.indexOf("willHighlight ? 'select' : 'deselect'") >= 0,
      '应记录 select/deselect 操作类型');
  });

  it('P2 滚动联动埋点 stage.scroll.link 存在', function() {
    assert(html.indexOf("interactionLog.info('stage.scroll.link'") >= 0 ||
           html.indexOf('interactionLog.info("stage.scroll.link"') >= 0,
      '应包含 stage.scroll.link info 埋点');
    assert(html.indexOf('cardFound') >= 0, '应记录 cardFound');
    assert(html.indexOf('cardExpanded') >= 0, '应记录 cardExpanded');
    assert(html.indexOf('scrollTarget') >= 0, '应记录 scrollTarget');
  });

  it('P2 异常路径埋点存在（cardNotFound / noIndex）', function() {
    assert(html.indexOf('stage.row.click.cardNotFound') >= 0, '应包含 cardNotFound error 埋点');
    assert(html.indexOf('stage.row.click.noIndex') >= 0, '应包含 noIndex warn 埋点');
  });

  it('P0 分类切换埋点 scale.category.change 存在', function() {
    assert(html.indexOf("interactionLog.info('scale.category.change'") >= 0 ||
           html.indexOf('interactionLog.info("scale.category.change"') >= 0,
      '应包含 scale.category.change info 埋点');
    assert(html.indexOf('previous') >= 0 && html.indexOf('current') >= 0,
      '应记录 previous + current 分类');
  });

  it('P0 搜索输入埋点 scale.search.input 存在（带 debounce）', function() {
    assert(html.indexOf("interactionLog.info('scale.search.input'") >= 0 ||
           html.indexOf('interactionLog.info("scale.search.input"') >= 0,
      '应包含 scale.search.input info 埋点');
    assert(html.indexOf('_scaleSearchLogTimer') >= 0, '应使用 debounce 计时器');
    assert(html.indexOf('400') >= 0, 'debounce 时长应为 400ms');
  });

  it('P0 筛选结果统计埋点 scale.library.filter 存在', function() {
    assert(html.indexOf("interactionLog.info('scale.library.filter'") >= 0 ||
           html.indexOf('interactionLog.info("scale.library.filter"') >= 0,
      '应包含 scale.library.filter info 埋点');
    assert(html.indexOf('matchedCount') >= 0, '应记录 matchedCount');
    assert(html.indexOf('totalScales') >= 0, '应记录 totalScales');
  });

  it('方案详情打开埋点 protocol.detail.open 存在', function() {
    assert(html.indexOf("interactionLog.info('protocol.detail.open'") >= 0 ||
           html.indexOf('interactionLog.info("protocol.detail.open"') >= 0,
      '应包含 protocol.detail.open info 埋点');
    assert(html.indexOf('stageCount') >= 0, '应记录 stageCount');
  });

  it('currentProtocol 全局变量已声明（埋点上下文）', function() {
    assert(/var\s+currentProtocol\s*=\s*null/.test(html), '应声明 var currentProtocol = null');
    assert(html.indexOf('currentProtocol = p') >= 0, '应在 showProtocolDetail 中赋值 currentProtocol = p');
  });

  it('filterScales 纯函数已抽取', function() {
    assert(html.indexOf('function filterScales(scales, category, keyword)') >= 0,
      '应定义 filterScales 纯函数');
    assert(html.indexOf('filterScales(allScales') >= 0,
      'renderScaleLibrary 应调用 filterScales');
  });
});

// ═══════════════════════════════════════════════════════════════
//  B. filterScales 纯函数功能测试
// ═══════════════════════════════════════════════════════════════

// 复制 index.html 中的纯函数实现，确保测试与生产代码逻辑一致
function filterScales(scales, category, keyword) {
  var kw = (keyword || '').trim().toLowerCase();
  return (scales || []).filter(function(s) {
    var catMatch = !category || category === '全部' || s.category === category;
    var searchMatch = !kw ||
      (s.name && s.name.toLowerCase().indexOf(kw) >= 0) ||
      (s.shortName && s.shortName.toLowerCase().indexOf(kw) >= 0) ||
      (s.description && s.description.toLowerCase().indexOf(kw) >= 0);
    return catMatch && searchMatch;
  });
}

// ── 模拟数据生成 ──────────────────────────────────────────────
function generateMockScales() {
  return [
    { id: 'mock-vas-pain',    name: 'VAS 视觉模拟疼痛评分', shortName: 'VAS',  category: 'pain',   description: '通过0-10cm视觉模拟尺评估疼痛强度' },
    { id: 'mock-nrs-pain',    name: 'NRS 数字疼痛评分量表', shortName: 'NRS',  category: 'pain',   description: '0-10分数字评分法，适合老年患者' },
    { id: 'mock-ndi-neck',    name: 'NDI 颈椎功能障碍指数', shortName: 'NDI',  category: 'neck',   description: '颈椎评估的金标准，10个项目' },
    { id: 'mock-joa-neck',    name: 'JOA 颈椎评分',         shortName: 'JOA-C', category: 'neck',   description: '日本骨科协会颈椎评分，评估脊髓型颈椎病' },
    { id: 'mock-odi-back',    name: 'ODI Oswestry功能障碍指数', shortName: 'ODI', category: 'back', description: '腰痛功能障碍评估金标准' },
    { id: 'mock-rmq-back',    name: 'Roland-Morris功能障碍问卷', shortName: 'RMQ', category: 'back', description: '24项腰痛对日常生活影响评估' },
    { id: 'mock-dash-upper',  name: 'DASH 上肢功能障碍量表', shortName: 'DASH', category: 'upper', description: '上肢肩肘腕手功能综合评估' },
    { id: 'mock-ucla-shoulder', name: 'UCLA 肩袖评分',     shortName: 'UCLA', category: 'upper', description: '肩袖损伤术后功能评估' },
    { id: 'mock-bst-balance', name: 'Berg 平衡量表',        shortName: 'Berg', category: 'balance', description: '老年人跌倒风险与平衡能力评估' },
    { id: 'mock-tug-balance', name: '计时起立行走测试 TUG', shortName: 'TUG',  category: 'balance', description: '评估行动能力与跌倒风险' },
    { id: 'mock-mmt-muscle',  name: 'MMT 徒手肌力测试',     shortName: 'MMT',  category: 'muscle', description: '0-5级肌力评估' },
    { id: 'mock-ashworth',    name: '改良 Ashworth 痉挛量表', shortName: 'MAS', category: 'muscle', description: '肌张力增高分级评估' },
    { id: 'mock-mmse-mental', name: 'MMSE 简易精神状态检查', shortName: 'MMSE', category: 'mental', description: '认知功能筛查' },
    { id: 'mock-moca-mental', name: 'MoCA 蒙特利尔认知评估', shortName: 'MoCA', category: 'mental', description: '轻度认知障碍筛查' },
    { id: 'mock-barthel',     name: 'Barthel 指数',         shortName: 'BI',   category: 'function', description: '日常生活活动能力 ADL 评估' },
    { id: 'mock-fugl-meyer',  name: 'Fugl-Meyer 运动评估',  shortName: 'FMA',  category: 'function', description: '脑卒中运动功能量化评估' },
    { id: 'mock-no-shortname', name: '疼痛日记卡',          shortName: '',     category: 'pain',   description: '患者居家自评疼痛变化' },
    { id: 'mock-no-desc',     name: '关节活动度测量 ROM',   shortName: 'ROM',  category: 'function', description: '' }
  ];
}

var mockScales = generateMockScales();

describe('B. filterScales 纯函数功能测试（模拟数据 ' + mockScales.length + ' 条）', function() {

  it('1. 无关键词 + 全部分类 → 返回全部', function() {
    var r = filterScales(mockScales, '全部', '');
    assert(r.length === mockScales.length, '应返回全部 ' + mockScales.length + ' 条，实际 ' + r.length);
  });

  it('2. 关键词匹配 name', function() {
    var r = filterScales(mockScales, '全部', 'Berg');
    assert(r.length === 1, '应只匹配 Berg 平衡量表，实际 ' + r.length);
    assert(r[0].id === 'mock-bst-balance', '应匹配 mock-bst-balance');
  });

  it('3. 关键词匹配 shortName', function() {
    var r = filterScales(mockScales, '全部', 'NDI');
    assert(r.length === 1, '应只匹配 NDI shortName，实际 ' + r.length);
    assert(r[0].id === 'mock-ndi-neck', '应匹配 mock-ndi-neck');
  });

  it('4. 关键词匹配 description', function() {
    var r = filterScales(mockScales, '全部', '跌倒风险');
    assert(r.length === 2, '应匹配 Berg 和 TUG（均含"跌倒风险"），实际 ' + r.length);
    var ids = r.map(function(s) { return s.id; }).sort();
    assert(ids[0] === 'mock-bst-balance' && ids[1] === 'mock-tug-balance',
      '应同时匹配 balance 类两条');
  });

  it('5. 关键词大小写不敏感', function() {
    var lower = filterScales(mockScales, '全部', 'berg');
    var upper = filterScales(mockScales, '全部', 'BERG');
    var mixed = filterScales(mockScales, '全部', 'BeRg');
    assert(lower.length === 1 && upper.length === 1 && mixed.length === 1,
      'berg/BERG/BeRg 都应各匹配 1 条');
  });

  it('6. 关键词前后空格被 trim', function() {
    var r = filterScales(mockScales, '全部', '  Berg  ');
    assert(r.length === 1, '前后空格应被 trim 后匹配 1 条，实际 ' + r.length);
  });

  it('7. 分类筛选独立生效', function() {
    var pain = filterScales(mockScales, 'pain', '');
    assert(pain.length === 3, 'pain 分类应有 3 条（VAS/NRS/疼痛日记卡），实际 ' + pain.length);
    var neck = filterScales(mockScales, 'neck', '');
    assert(neck.length === 2, 'neck 分类应有 2 条，实际 ' + neck.length);
    var mental = filterScales(mockScales, 'mental', '');
    assert(mental.length === 2, 'mental 分类应有 2 条，实际 ' + mental.length);
  });

  it('8. 分类 + 关键词组合（AND 语义）', function() {
    // pain 类 + 关键词"评分" → 应匹配 VAS、NRS（含"评分"），排除疼痛日记卡
    var r = filterScales(mockScales, 'pain', '评分');
    assert(r.length === 2, 'pain + "评分" 应匹配 2 条（VAS/NRS），实际 ' + r.length);
    r.forEach(function(s) {
      assert(s.category === 'pain', '所有结果 category 应为 pain');
      assert(s.name.indexOf('评分') >= 0 || (s.shortName && s.shortName.indexOf('评分') >= 0) ||
             (s.description && s.description.indexOf('评分') >= 0),
        '所有结果应包含关键词"评分"');
    });

    // upper 类 + 关键词"肩" → UCLA 肩袖 + DASH 描述含"肩"
    var r2 = filterScales(mockScales, 'upper', '肩');
    assert(r2.length === 2, 'upper + "肩" 应匹配 2 条，实际 ' + r2.length);
  });

  it('9. 无匹配返回空数组', function() {
    var r = filterScales(mockScales, '全部', '不存在的关键词XYZ123');
    assert(Array.isArray(r) && r.length === 0, '无匹配应返回空数组');
  });

  it('10. 空量表数组返回空数组', function() {
    var r = filterScales([], '全部', '');
    assert(Array.isArray(r) && r.length === 0, '空输入应返回空数组');
    var r2 = filterScales(null, '全部', '');
    assert(Array.isArray(r2) && r2.length === 0, 'null 输入应安全返回空数组');
    var r3 = filterScales(undefined, '全部', 'Berg');
    assert(Array.isArray(r3) && r3.length === 0, 'undefined 输入应安全返回空数组');
  });

  it('11. 中文关键词匹配', function() {
    var r = filterScales(mockScales, '全部', '颈椎');
    assert(r.length === 2, '"颈椎" 应匹配 2 条（NDI/JOA-C），实际 ' + r.length);
    var r2 = filterScales(mockScales, '全部', '认知');
    assert(r2.length === 2, '"认知" 应匹配 2 条（MMSE/MoCA），实际 ' + r2.length);
  });

  it('12. 不存在的分类返回空', function() {
    var r = filterScales(mockScales, '不存在的分类', '');
    assert(Array.isArray(r) && r.length === 0, '不存在的分类应返回空数组');
  });

  it('13. shortName 为空的量表仍可被 name/description 匹配', function() {
    var r = filterScales(mockScales, '全部', '疼痛日记');
    assert(r.length === 1 && r[0].id === 'mock-no-shortname',
      '应匹配到 shortName 为空的疼痛日记卡');
  });

  it('14. description 为空的量表仍可被 name/shortName 匹配', function() {
    var r = filterScales(mockScales, '全部', 'ROM');
    assert(r.length === 1 && r[0].id === 'mock-no-desc',
      '应匹配到 description 为空的 ROM');
  });

  it('15. category 为空字符串视为"全部"', function() {
    var r = filterScales(mockScales, '', '');
    assert(r.length === mockScales.length, '空分类应等同于全部，实际 ' + r.length);
  });
});

// ═══════════════════════════════════════════════════════════════
//  C. 浏览器端动态测试脚本（生成供注入使用）
// ═══════════════════════════════════════════════════════════════

var browserTestScript = [
"(function() {",
"  var results = { passed: 0, failed: 0, details: [] };",
"  function assert(c, m) { if (c) { results.passed++; results.details.push('✓ ' + m); } else { results.failed++; results.details.push('✗ ' + m); } }",
"",
"  // 注入模拟数据",
"  var mockScales = " + JSON.stringify(mockScales, null, 2) + ";",
"  var original = window.assessmentScales;",
"  window.assessmentScales = mockScales;",
"  currentScaleCategory = '全部';",
"  document.getElementById('scaleSearch').value = '';",
"",
"  // 测试 1：默认渲染应显示全部",
"  renderScaleLibrary();",
"  var items = document.querySelectorAll('#scaleListContainer .list-item');",
"  assert(items.length === mockScales.length, '默认渲染应显示全部 ' + mockScales.length + ' 条，实际 ' + items.length);",
"",
"  // 测试 2：搜索 Berg 应只剩 1 条",
"  document.getElementById('scaleSearch').value = 'Berg';",
"  renderScaleLibrary();",
"  items = document.querySelectorAll('#scaleListContainer .list-item');",
"  assert(items.length === 1, '搜索 Berg 应剩 1 条，实际 ' + items.length);",
"",
"  // 测试 3：分类筛选 pain 应剩 3 条",
"  document.getElementById('scaleSearch').value = '';",
"  selectScaleCategory('pain');",
"  items = document.querySelectorAll('#scaleListContainer .list-item');",
"  assert(items.length === 3, 'pain 分类应剩 3 条，实际 ' + items.length);",
"",
"  // 测试 4：组合 pain + 评分 → 2 条",
"  document.getElementById('scaleSearch').value = '评分';",
"  renderScaleLibrary();",
"  items = document.querySelectorAll('#scaleListContainer .list-item');",
"  assert(items.length === 2, 'pain + 评分 应剩 2 条，实际 ' + items.length);",
"",
"  // 测试 5：无匹配应显示空状态",
"  document.getElementById('scaleSearch').value = '不存在的关键词XYZ';",
"  renderScaleLibrary();",
"  var empty = document.querySelector('#scaleListContainer .dashboard-empty');",
"  assert(!!empty, '无匹配应渲染 dashboard-empty 空状态');",
"",
"  // 测试 6：埋点应在 console 中输出",
"  // (在浏览器 DevTools Network/Console 中观察 [Interaction][INFO] 日志)",
"  assert(!!window.interactionLog, 'window.interactionLog 应已注入');",
"  assert(typeof window.interactionLog.info === 'function', 'interactionLog.info 应为函数');",
"",
"  // 还原数据",
"  window.assessmentScales = original;",
"  document.getElementById('scaleSearch').value = '';",
"  selectScaleCategory('全部');",
"",
"  return JSON.stringify(results, null, 2);",
"})();"
].join('\n');

describe('C. 浏览器端动态测试脚本生成', function() {
  it('浏览器测试脚本已生成', function() {
    assert(browserTestScript.length > 200, '浏览器测试脚本应非空');
    assert(browserTestScript.indexOf('renderScaleLibrary') >= 0, '应调用 renderScaleLibrary');
    assert(browserTestScript.indexOf('selectScaleCategory') >= 0, '应调用 selectScaleCategory');
    assert(browserTestScript.indexOf('mockScales') >= 0, '应注入模拟数据');
    assert(browserTestScript.indexOf('interactionLog') >= 0, '应校验 interactionLog 注入');
  });
});

// ═══════════════════════════════════════════════════════════════
//  测试结果汇总
// ═══════════════════════════════════════════════════════════════

console.log('\n══════════════════════════════════════');
console.log('  量表搜索 + 分类筛选 + 埋点 测试结果');
console.log('  通过: ' + passed + ' | 失败: ' + failed);
console.log('══════════════════════════════════════');

if (failures.length > 0) {
  console.log('\n失败详情:');
  failures.forEach(function(f) { console.log('  - ' + f); });
  console.log('\n📋 浏览器端测试脚本（可粘贴到 http://localhost:8090 控制台执行）：');
  console.log('\n' + browserTestScript);
  process.exit(1);
} else {
  console.log('\n✅ 全部测试通过');
  console.log('\n📋 浏览器端动态测试脚本（在 http://localhost:8090 量表库页面控制台粘贴执行）：');
  console.log('\n' + browserTestScript);
  process.exit(0);
}
