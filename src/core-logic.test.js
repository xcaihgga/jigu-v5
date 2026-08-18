/**
 * ═══════════════════════════════════════════════════════════════
 *  核心逻辑单元测试
 *  运行方式：node src/core-logic.test.js
 * ═══════════════════════════════════════════════════════════════
 *
 *  测试覆盖：
 *    1. escapeHtml — XSS 转义
 *    2. safeGetJSON — localStorage 安全读取
 *    3. normName — 量表名称归一化去重
 *    4. filterScales — 搜索 + 分类筛选
 *    5. convertExtraScale — extra 量表结构转换
 *    6. getInterpretation — 分数解读
 *    7. formatDate / formatDateShort — 日期格式化
 *    8. initAllScales 去重逻辑 — 语义重复量表跳过
 */

// ── 测试框架（与 evidence-field.test.js 风格一致） ──
let passed = 0, failed = 0;
const failures = [];

function assert(condition, message) {
  if (condition) { passed++; }
  else { failed++; failures.push(message); console.error('  ✗ FAIL: ' + message); }
}

function assertEqual(actual, expected, message) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (ok) { passed++; }
  else {
    failed++;
    failures.push(message + ' (expected: ' + JSON.stringify(expected) + ', got: ' + JSON.stringify(actual) + ')');
    console.error('  ✗ FAIL: ' + message);
    console.error('    expected:', JSON.stringify(expected));
    console.error('    actual:  ', JSON.stringify(actual));
  }
}

function testGroup(name, fn) {
  console.log('\n── ' + name + ' ──');
  fn();
}

// ── Mock 环境 ──
const mockStorage = {};
global.localStorage = {
  getItem: function(k) { return k in mockStorage ? mockStorage[k] : null; },
  setItem: function(k, v) { mockStorage[k] = String(v); },
  removeItem: function(k) { delete mockStorage[k]; },
};
global.window = {
  interactionLog: { debug: function(){}, info: function(){}, warn: function(){}, error: function(){} },
  assessmentScales: undefined,
};
global.alert = function(msg) { /* swallow */ };

// ── 从 index.html 提取的纯函数（拆分后改为 require） ──

// 1. escapeHtml
function escapeHtml(val) {
  if (val === null || val === undefined) return '';
  return String(val)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// 1.5. escapeAttr（属性专用，与 escapeHtml 输出一致，语义区分）
function escapeAttr(val) {
  if (val === null || val === undefined) return '';
  return String(val)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// 2. safeGetJSON
var __lsCorruptWarned = false;
function safeGetJSON(key, fallback) {
  var fb = (fallback === undefined) ? [] : fallback;
  try {
    var raw = localStorage.getItem(key);
    if (raw === null) return fb;
    return JSON.parse(raw);
  } catch (e) {
    try { localStorage.removeItem(key); } catch (_) {}
    if (!__lsCorruptWarned) {
      __lsCorruptWarned = true;
      setTimeout(function() { __lsCorruptWarned = false; }, 0);
    }
    return fb;
  }
}

// 3. normName（从 initAllScales 提取）
function normName(n) {
  return (n || '').replace(/[\s\(\)\[\]\-\—_（）【】]/g, '').toLowerCase();
}

// 4. filterScales
function filterScales(scales, category, keyword) {
  var kw = (keyword || '').trim().toLowerCase();
  var input = scales || [];
  var matched = [];
  input.forEach(function(s) {
    var catMatch = !category || category === '全部' || s.category === category;
    var hitFields = [];
    if (kw) {
      if (s.name && s.name.toLowerCase().indexOf(kw) >= 0) hitFields.push('name');
      if (s.shortName && s.shortName.toLowerCase().indexOf(kw) >= 0) hitFields.push('shortName');
      if (s.description && s.description.toLowerCase().indexOf(kw) >= 0) hitFields.push('description');
    }
    var searchMatch = !kw || hitFields.length > 0;
    if (catMatch && searchMatch) matched.push(s);
  });
  return matched;
}

// 5. convertExtraScale
function convertExtraScale(extra) {
  var questions = (extra.questions || []).map(function(q) {
    return {
      text: q.text,
      options: (q.options || []).map(function(opt) { return opt.text; }),
      scores: (q.options || []).map(function(opt) { return opt.score || 0; })
    };
  });
  var totalScore = 0;
  questions.forEach(function(q) {
    if (q.scores && q.scores.length) {
      totalScore += Math.max.apply(null, q.scores);
    }
  });
  var levels = (extra.scoring && extra.scoring.levels) ? extra.scoring.levels : [];
  var interpretation = levels.map(function(lvl) {
    var color = 'warning';
    var lv = (lvl.level || '').toLowerCase();
    if (lv.includes('正常') || lv.includes('优') || lv.includes('良') || lv.includes('好') || lv.includes('独立') || lv.includes('低')) {
      color = 'success';
    } else if (lv.includes('中') || lv.includes('可') || lv.includes('轻度')) {
      color = 'warning';
    } else {
      color = 'danger';
    }
    return { min: lvl.min, max: lvl.max, level: lvl.level, color: color, desc: lvl.advice || '' };
  });
  var shortName = '';
  var enMatch = extra.name.match(/^([A-Za-z0-9\-]+)/);
  if (enMatch) shortName = enMatch[1];
  else shortName = extra.name.slice(0, 6);
  var catMap = {
    '平衡': 'balance', '运动功能': 'function', '肌力与痉挛': 'muscle',
    '关节活动度': 'function', '日常生活': 'function', '疼痛': 'pain',
    '认知与心理': 'mental', '吞咽与言语': 'quality'
  };
  return {
    id: extra.id, name: extra.name, shortName: shortName,
    category: catMap[extra.category] || 'function',
    description: extra.description || '',
    reliability: extra.instructions || '',
    reference: '临床常用评估量表',
    totalScore: totalScore, type: 'choice',
    questions: questions, interpretation: interpretation,
    calculate: function(answers) {
      var total = 0;
      answers.forEach(function(a) { total += (a || 0); });
      return { score: total, maxScore: totalScore };
    }
  };
}

// 6. getInterpretation
function getInterpretation(score, maxScore, interpretations) {
  var sorted = interpretations.slice().sort(function(a, b) { return a.min - b.min; });
  for (var i = sorted.length - 1; i >= 0; i--) {
    if (score >= sorted[i].min) return sorted[i];
  }
  return sorted[0] || { level: '未知', color: 'other', desc: '' };
}

// 7. formatDate / formatDateShort
function formatDate(date) {
  var d = new Date(date);
  var y = d.getFullYear();
  var m = String(d.getMonth() + 1).padStart(2, '0');
  var day = String(d.getDate()).padStart(2, '0');
  var h = String(d.getHours()).padStart(2, '0');
  var min = String(d.getMinutes()).padStart(2, '0');
  return y + '-' + m + '-' + day + ' ' + h + ':' + min;
}
function formatDateShort(date) {
  var d = new Date(date);
  var m = String(d.getMonth() + 1).padStart(2, '0');
  var day = String(d.getDate()).padStart(2, '0');
  return m + '/' + day;
}

// ═══════════════════════════════════════════════════════════════
//  测试用例
// ═══════════════════════════════════════════════════════════════

// ── 1. escapeHtml ──
testGroup('escapeHtml — XSS 转义', function() {
  assertEqual(escapeHtml(null), '', 'null 返回空串');
  assertEqual(escapeHtml(undefined), '', 'undefined 返回空串');
  assertEqual(escapeHtml(''), '', '空串返回空串');
  assertEqual(escapeHtml('hello'), 'hello', '纯文本不转义');
  assertEqual(escapeHtml('<script>alert(1)</script>'), '&lt;script&gt;alert(1)&lt;/script&gt;', 'script 标签转义');
  assertEqual(escapeHtml('a & b'), 'a &amp; b', '& 转义');
  assertEqual(escapeHtml('"quote"'), '&quot;quote&quot;', '双引号转义');
  assertEqual(escapeHtml("it's"), 'it&#39;s', '单引号转义');
  assertEqual(escapeHtml(123), '123', '数字转字符串');
  assertEqual(escapeHtml('<img onerror=alert(1)>'), '&lt;img onerror=alert(1)&gt;', 'img onerror 转义');
  // 组合攻击
  var malicious = '"><script>alert(document.cookie)</script>';
  var escaped = escapeHtml(malicious);
  assert(escaped.indexOf('<script>') === -1, '组合 XSS 被完全转义');
  assert(escaped.indexOf('">') === -1, '属性注入被转义');
});

// ── 1.5. escapeAttr — 属性级转义（本次安全修复新增） ──
testGroup('escapeAttr — HTML 属性级转义（新增）', function() {
  // 基础类型
  assertEqual(escapeAttr(null), '', 'null 返回空串');
  assertEqual(escapeAttr(undefined), '', 'undefined 返回空串');
  assertEqual(escapeAttr(''), '', '空串返回空串');
  assertEqual(escapeAttr(123), '123', '数字转字符串');
  assertEqual(escapeAttr('hello'), 'hello', '纯文本不转义');

  // 双引号注入：value="xxx" 被 " 突破
  var breakDouble = 'test" autofocus onfocus="alert(1)';
  var bdEsc = escapeAttr(breakDouble);
  assert(bdEsc.indexOf('"') === -1, '双引号完全转义，不可突破 value="..."');
  assertEqual(bdEsc, 'test&quot; autofocus onfocus=&quot;alert(1)', '双引号转义结果精确');

  // 单引号注入：value='xxx' 被 ' 突破
  var breakSingle = "it's\" onmouseover=alert(2)";
  var bsEsc = escapeAttr(breakSingle);
  assert(bsEsc.indexOf("'") === -1, '单引号完全转义，不可突破 value=...');
  assertEqual(bsEsc, 'it&#39;s&quot; onmouseover=alert(2)', '单引号转义结果精确');

  // 组合攻击：闭合属性 + 注入事件 + 再闭合
  var combo = '"><img src=x onerror=alert(3)><input value="';
  var ceEsc = escapeAttr(combo);
  assert(ceEsc.indexOf('<img') === -1, '标签开始被转义');
  assert(ceEsc.indexOf('onerror') === -1 || ceEsc.indexOf('<img') === -1, '无法注入标签上下文');
  assert(ceEsc.indexOf('">') === -1, '属性无法再闭合');

  // 与 escapeHtml 语义等价（保证两种 API 输出一致）
  var samples = [null, undefined, '', 'abc', '<>&"\'特殊', 123];
  for (var i = 0; i < samples.length; i++) {
    assertEqual(escapeAttr(samples[i]), escapeHtml(samples[i]),
      'escapeAttr 与 escapeHtml 输出一致 #' + i);
  }

  // 属性值反序列化验证：将转义结果放回 HTML 属性，再读 DOM，应与原值一致（逻辑验证）
  // 模拟 value="<escaped>" 解还原后等于原始（字符串比较）
  var original = '测试"活动\'名<>&测试';
  var escaped = escapeAttr(original);
  // 模拟浏览器的属性解码：反转所有实体 → 应等于原值
  var decoded = escaped
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
  assertEqual(decoded, original, '属性解码完全还原为原值（不丢失字符）');
});

// ── 2. safeGetJSON ──
testGroup('safeGetJSON — localStorage 安全读取', function() {
  // 正常数据
  mockStorage['test_good'] = JSON.stringify([1, 2, 3]);
  assertEqual(safeGetJSON('test_good'), [1, 2, 3], '正常 JSON 数组读取');

  // 对象
  mockStorage['test_obj'] = JSON.stringify({ a: 1 });
  assertEqual(safeGetJSON('test_obj'), { a: 1 }, '正常 JSON 对象读取');

  // 不存在的 key
  assertEqual(safeGetJSON('not_exist'), [], '不存在的 key 返回默认 []');

  // 自定义 fallback
  assertEqual(safeGetJSON('not_exist', null), null, '自定义 fallback null');

  // 损坏数据
  mockStorage['test_bad'] = '{invalid json!!!';
  assertEqual(safeGetJSON('test_bad'), [], '损坏 JSON 返回默认 []');
  assert(mockStorage['test_bad'] === undefined, '损坏数据被自动清理');

  // 损坏数据带 fallback
  mockStorage['test_bad2'] = 'not json at all';
  assertEqual(safeGetJSON('test_bad2', { ok: true }), { ok: true }, '损坏 JSON 返回自定义 fallback');
  assert(mockStorage['test_bad2'] === undefined, '损坏数据2被自动清理');

  // 空字符串
  mockStorage['test_empty'] = '';
  assertEqual(safeGetJSON('test_empty'), [], '空字符串返回默认 []');
});

// ── 3. normName ──
testGroup('normName — 量表名称归一化去重', function() {
  assertEqual(normName('VAS 视觉模拟疼痛评分'), 'vas视觉模拟疼痛评分', '空格被去除');
  assertEqual(normName('Berg 平衡量表 (BBS)'), 'berg平衡量表bbs', '括号和空格被去除');
  assertEqual(normName('Berg平衡量表'), 'berg平衡量表', '中文无空格');
  assertEqual(normName('  Berg  平衡量表  '), 'berg平衡量表', '首尾和中间多余空格');
  assertEqual(normName('Barthel 指数'), 'barthel指数', '混合空格');
  assertEqual(normName('Barthel指数'), 'barthel指数', '无空格与有空格归一化结果一致');
  assertEqual(normName('FIM 功能独立性评定'), 'fim功能独立性评定', 'FIM 带空格');
  assertEqual(normName('FIM功能独立性评定'), 'fim功能独立性评定', 'FIM 无空格——与上面一致');
  assertEqual(normName('MMT 徒手肌力测试'), 'mmt徒手肌力测试', 'MMT 带空格');
  assertEqual(normName('MMT徒手肌力测试(0-5级)'), 'mmt徒手肌力测试05级', '括号和短横线被去除');
  assertEqual(normName(''), '', '空串');
  assertEqual(normName(null), '', 'null');
  assertEqual(normName(undefined), '', 'undefined');
  assertEqual(normName('ODI Oswestry功能障碍指数'), 'odioswestry功能障碍指数', 'ODI');
  assertEqual(normName('Oswestry功能障碍指数'), 'oswestry功能障碍指数', 'Oswestry——与 ODI 不同，不误杀');
});

// ── 4. filterScales ──
testGroup('filterScales — 搜索 + 分类筛选', function() {
  var testScales = [
    { id: 'vas', name: 'VAS 视觉模拟疼痛评分', shortName: 'VAS', category: 'pain', description: '疼痛评估工具' },
    { id: 'nrs', name: 'NRS 数字疼痛评分量表', shortName: 'NRS', category: 'pain', description: '数字评分' },
    { id: 'berg', name: 'Berg 平衡量表', shortName: 'Berg', category: 'balance', description: '平衡功能评定' },
    { id: 'barthel', name: 'Barthel 指数', shortName: 'Barthel', category: 'function', description: '日常生活活动能力' },
  ];

  // 无筛选条件
  assertEqual(filterScales(testScales, '全部', '').length, 4, '全部+无关键词 → 全部返回');
  assertEqual(filterScales(testScales, null, null).length, 4, 'category=null+keyword=null → 全部返回');

  // 仅分类筛选
  assertEqual(filterScales(testScales, 'pain', '').length, 2, '分类=pain → 2条');
  assertEqual(filterScales(testScales, 'balance', '').length, 1, '分类=balance → 1条');
  assertEqual(filterScales(testScales, 'function', '').length, 1, '分类=function → 1条');

  // 仅关键词搜索
  assertEqual(filterScales(testScales, '全部', '疼痛').length, 2, '关键词=疼痛 → 匹配 name/desc 含疼痛的 2条');
  assertEqual(filterScales(testScales, '全部', 'VAS').length, 1, '关键词=VAS → 匹配 shortName 1条');
  assertEqual(filterScales(testScales, '全部', '平衡').length, 1, '关键词=平衡 → 1条');
  assertEqual(filterScales(testScales, '全部', '日常生活').length, 1, '关键词匹配 description → 1条');
  assertEqual(filterScales(testScales, '全部', '不存在的量表').length, 0, '不匹配的关键词 → 0条');

  // 分类 + 关键词联合
  assertEqual(filterScales(testScales, 'pain', 'VAS').length, 1, 'pain+VAS → 1条');
  assertEqual(filterScales(testScales, 'pain', '平衡').length, 0, 'pain+平衡 → 0条（分类不匹配）');
  assertEqual(filterScales(testScales, 'balance', '疼痛').length, 0, 'balance+疼痛 → 0条（关键词不匹配）');

  // 大小写
  assertEqual(filterScales(testScales, '全部', 'vas').length, 1, '关键词小写 vas → 匹配 VAS');
  assertEqual(filterScales(testScales, '全部', 'VAs').length, 1, '关键词混合大小写 VAs → 匹配');

  // 空数组
  assertEqual(filterScales([], '全部', 'test').length, 0, '空数组 → 0条');
  assertEqual(filterScales(null, '全部', '').length, 0, 'null → 0条');

  // 关键词首尾空格
  assertEqual(filterScales(testScales, '全部', '  疼痛  ').length, 2, '关键词首尾空格被 trim');
});

// ── 5. convertExtraScale ──
testGroup('convertExtraScale — extra 量表结构转换', function() {
  var extraScale = {
    id: 'test-scale',
    name: 'Test Scale 测试量表',
    category: '平衡',
    description: '测试用平衡量表',
    instructions: '请按说明操作',
    questions: [
      { text: '问题1', options: [{ text: '选项A', score: 0 }, { text: '选项B', score: 2 }] },
      { text: '问题2', options: [{ text: '选项C', score: 1 }, { text: '选项D', score: 3 }] },
    ],
    scoring: {
      levels: [
        { min: 0, max: 2, level: '差', advice: '需要干预' },
        { min: 3, max: 5, level: '正常', advice: '功能正常' },
      ]
    }
  };

  var converted = convertExtraScale(extraScale);

  assertEqual(converted.id, 'test-scale', 'id 保留');
  assertEqual(converted.name, 'Test Scale 测试量表', 'name 保留');
  assertEqual(converted.shortName, 'Test', 'shortName 提取英文前缀');
  assertEqual(converted.category, 'balance', 'category 映射 平衡→balance');
  assertEqual(converted.type, 'choice', 'type 固定为 choice');
  assertEqual(converted.totalScore, 5, 'totalScore = max(0,2) + max(1,3) = 5');
  assertEqual(converted.questions.length, 2, 'questions 数量正确');
  assertEqual(converted.questions[0].options, ['选项A', '选项B'], 'options 提取 text');
  assertEqual(converted.questions[0].scores, [0, 2], 'scores 提取 score');

  // interpretation 颜色映射
  assertEqual(converted.interpretation.length, 2, 'interpretation 2 条');
  assertEqual(converted.interpretation[0].color, 'danger', '「差」→ danger');
  assertEqual(converted.interpretation[1].color, 'success', '「正常」→ success');
  assertEqual(converted.interpretation[1].desc, '功能正常', 'desc 从 advice 提取');

  // calculate 函数
  var calcResult = converted.calculate([2, 3]);
  assertEqual(calcResult.score, 5, 'calculate([2,3]) = 5');
  assertEqual(calcResult.maxScore, 5, 'maxScore = 5');

  // calculate 空答案
  var calcEmpty = converted.calculate([]);
  assertEqual(calcEmpty.score, 0, 'calculate([]) = 0');

  // calculate 含 null
  var calcNull = converted.calculate([null, 3]);
  assertEqual(calcNull.score, 3, 'calculate([null,3]) = 3（null 当 0）');

  // 纯中文名称的 shortName（slice(0,6) 取前 6 个字符）
  var cnScale = convertExtraScale({ id: 'cn', name: '洼田饮水试验', category: '吞咽与言语' });
  assertEqual(cnScale.shortName, '洼田饮水试验', '纯中文名称 shortName 取前 6 字（恰为 6 字时全取）');
  assertEqual(cnScale.category, 'quality', '吞咽与言语 → quality');

  // 未知分类
  var unknownCat = convertExtraScale({ id: 'unk', name: 'Unknown', category: '未知分类' });
  assertEqual(unknownCat.category, 'function', '未知分类 → function 兜底');

  // 无 questions
  var noQ = convertExtraScale({ id: 'noq', name: 'No Questions', category: '疼痛' });
  assertEqual(noQ.totalScore, 0, '无 questions → totalScore=0');
  assertEqual(noQ.questions.length, 0, '无 questions → 空数组');
  assertEqual(noQ.interpretation.length, 0, '无 scoring → interpretation 空数组');
});

// ── 6. getInterpretation ──
testGroup('getInterpretation — 分数解读', function() {
  var interp = [
    { min: 0, max: 3, level: '轻度', color: 'success', desc: '轻微' },
    { min: 4, max: 6, level: '中度', color: 'warning', desc: '中等' },
    { min: 7, max: 10, level: '重度', color: 'danger', desc: '严重' },
  ];

  assertEqual(getInterpretation(0, 10, interp).level, '轻度', '0 分 → 轻度');
  assertEqual(getInterpretation(3, 10, interp).level, '轻度', '3 分 → 轻度（边界）');
  assertEqual(getInterpretation(4, 10, interp).level, '中度', '4 分 → 中度');
  assertEqual(getInterpretation(6, 10, interp).level, '中度', '6 分 → 中度（边界）');
  assertEqual(getInterpretation(7, 10, interp).level, '重度', '7 分 → 重度');
  assertEqual(getInterpretation(10, 10, interp).level, '重度', '10 分 → 重度（最大值）');

  // 乱序输入也能正确排序
  var unsorted = [
    { min: 7, max: 10, level: '重度' },
    { min: 0, max: 3, level: '轻度' },
    { min: 4, max: 6, level: '中度' },
  ];
  assertEqual(getInterpretation(5, 10, unsorted).level, '中度', '乱序 interpretation → 正确返回');

  // 超出范围
  assertEqual(getInterpretation(15, 10, interp).level, '重度', '超出最大值 → 返回最高档');
  assertEqual(getInterpretation(-1, 10, interp).level, '轻度', '负分 → 返回最低档');

  // 空数组
  assertEqual(getInterpretation(5, 10, []).level, '未知', '空 interpretation → 未知');
});

// ── 7. formatDate / formatDateShort ──
testGroup('formatDate / formatDateShort — 日期格式化', function() {
  var d = new Date(2024, 0, 15, 9, 5); // 2024-01-15 09:05
  assertEqual(formatDate(d), '2024-01-15 09:05', 'formatDate 标准格式');
  assertEqual(formatDateShort(d), '01/15', 'formatDateShort 月/日');

  var d2 = new Date(2024, 11, 31, 23, 59); // 2024-12-31 23:59
  assertEqual(formatDate(d2), '2024-12-31 23:59', 'formatDate 年末');
  assertEqual(formatDateShort(d2), '12/31', 'formatDateShort 年末');

  var d3 = new Date(2024, 5, 1, 0, 0); // 2024-06-01 00:00
  assertEqual(formatDate(d3), '2024-06-01 00:00', 'formatDate 补零');
  assertEqual(formatDateShort(d3), '06/01', 'formatDateShort 补零');

  // 字符串日期
  assertEqual(formatDate('2024-03-08T14:30:00'), '2024-03-08 14:30', '字符串日期输入');
});

// ── 8. initAllScales 去重逻辑（模拟） ──
testGroup('initAllScales 去重逻辑 — 语义重复跳过', function() {
  // 模拟 initAllScales 的去重核心逻辑
  function simulateDedup(mainScales, extraScales) {
    var existingIds = new Set(mainScales.map(function(s) { return s.id; }));
    var existingNames = new Set(mainScales.map(function(s) { return normName(s.name); }));
    var result = mainScales.slice();
    var skipped = [];
    extraScales.forEach(function(extra) {
      if (existingIds.has(extra.id)) { skipped.push({ id: extra.id, reason: 'id-dup' }); return; }
      var nm = normName(extra.name);
      if (nm && existingNames.has(nm)) { skipped.push({ id: extra.id, name: extra.name, reason: 'name-dup' }); return; }
      result.push(extra);
      existingIds.add(extra.id);
      if (nm) existingNames.add(nm);
    });
    return { merged: result, skipped: skipped };
  }

  // 注意：normName 只去 空格/括号/短横线/大小写，不去字母后缀。
  // 因此测试数据要用「带空格 vs 不带空格」这类 normName 真正能识别的重复，
  // 而非「Berg (BBS) vs Berg」这种带后缀变体（normName 会判为不同）。
  var main = [
    { id: 'berg', name: 'Berg 平衡量表' },
    { id: 'mmt', name: 'MMT 徒手肌力测试' },
    { id: 'barthel', name: 'Barthel 指数' },
  ];
  var extra = [
    { id: 'berg-balance', name: 'Berg平衡量表' },        // 语义重复（仅空格差异）
    { id: 'mmt-grade', name: 'MMT徒手肌力测试' },         // 语义重复（仅空格差异）
    { id: 'tug', name: 'TUG起立行走测试' },               // 不重复
    { id: 'barthel-original', name: 'Barthel指数' },     // 语义重复（仅空格差异）
    { id: 'fim-extra', name: 'FIM功能独立性评定' },       // 不重复（主库无 FIM）
  ];

  var result = simulateDedup(main, extra);

  assertEqual(result.merged.length, 5, '合并后 5 条（3 主 + 2 新）');
  assertEqual(result.skipped.length, 3, '跳过 3 条语义重复');
  assertEqual(result.skipped[0].id, 'berg-balance', '跳过 Berg 重复');
  assertEqual(result.skipped[0].reason, 'name-dup', 'Berg 重复原因 = name-dup');
  assertEqual(result.skipped[1].id, 'mmt-grade', '跳过 MMT 重复');
  assertEqual(result.skipped[2].id, 'barthel-original', '跳过 Barthel 重复');

  // 确认不重复的被保留
  var mergedIds = result.merged.map(function(s) { return s.id; });
  assert(mergedIds.indexOf('tug') >= 0, 'TUG 被保留');
  assert(mergedIds.indexOf('fim-extra') >= 0, 'FIM-extra 被保留');
  assert(mergedIds.indexOf('berg-balance') === -1, 'berg-balance 被跳过');

  // id 重复也跳过
  var result2 = simulateDedup([{ id: 'x', name: 'X' }], [{ id: 'x', name: 'Different Name' }]);
  assertEqual(result2.merged.length, 1, 'id 重复时跳过');
  assertEqual(result2.skipped[0].reason, 'id-dup', 'id 重复原因 = id-dup');
});

// ═══════════════════════════════════════════════════════════════
//  结果汇总
// ═══════════════════════════════════════════════════════════════
console.log('\n═══════════════════════════════════════════════════════════════');
console.log('  核心逻辑单元测试结果');
console.log('═══════════════════════════════════════════════════════════════');
console.log('  ✅ 通过: ' + passed);
console.log('  ❌ 失败: ' + failed);
console.log('  📊 总计: ' + (passed + failed));
console.log('  🎯 状态: ' + (failed === 0 ? '✅ 全部通过' : '⚠️ 存在失败'));
if (failures.length > 0) {
  console.log('\n  失败详情:');
  failures.forEach(function(f) { console.log('    - ' + f); });
}
console.log('═══════════════════════════════════════════════════════════════');

process.exit(failed > 0 ? 1 : 0);
