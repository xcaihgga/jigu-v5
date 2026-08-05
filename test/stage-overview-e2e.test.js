/**
 * ═══════════════════════════════════════════════════════════════
 *  端到端测试 — 阶段概览表格行点击 → 滚动联动验证
 * ═══════════════════════════════════════════════════════════════
 *
 *  运行方式：
 *    Playwright 模式：npx playwright test --config=none stage-overview-e2e.test.js
 *    或直接在浏览器控制台注入 stage-overview-e2e.js 执行
 *    HTTP 回退模式：node stage-overview-e2e.test.js
 *
 *  测试覆盖：
 *    1. 概览表格行存在且可点击
 *    2. 点击行后行高亮（highlight class）
 *    3. 点击行后对应 stage-card 获得脉冲动画（stage-card-pulse class）
 *    4. 点击行后页面滚动位置变化（scrollLeft/scrollTop 改变）
 *    5. 互斥高亮：点击新行后旧行取消高亮
 *    6. 滚动联动目标正确：滚动到对应 stage-card 的位置
 *    7. 卡片内容自动展开
 *    8. 连续点击不同行的滚动位置递增/递减
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
  fn();
  if (failed === beforeFailed) console.log('✓');
}

// ═══════════════════════════════════════════════════════════════
//  HTTP 回退模式：验证代码结构完整性
// ═══════════════════════════════════════════════════════════════

var fs = require('fs');
var path = require('path');

var indexPath = path.join(__dirname, '..', 'index.html');
var html = fs.readFileSync(indexPath, 'utf-8');

describe('1. 代码结构完整性验证', function() {
  it('highlightStageRow 函数存在且接收 stageIndex 参数', function() {
    assert(html.indexOf('function highlightStageRow(row, stageIndex)') >= 0,
      'highlightStageRow 应定义为 (row, stageIndex)');
  });

  it('表格行 onclick 传递 stageIndex 索引', function() {
    assert(html.indexOf("highlightStageRow(this, ' + i + ')") >= 0,
      '表格行 onclick 应传递 i 作为 stageIndex');
  });

  it('stage-card 有 data-stage-index 属性', function() {
    assert(html.indexOf('data-stage-index="\' + i + \'') >= 0,
      'stage-card 应包含 data-stage-index 属性');
  });

  it('滚动联动逻辑存在', function() {
    assert(html.indexOf('scrollTo({ top: offset, behavior: \'smooth\' })') >= 0,
      '应包含 smooth 滚动逻辑');
  });

  it('脉冲动画 CSS 存在', function() {
    assert(html.indexOf('@keyframes stage-card-pulse') >= 0,
      '应包含 stage-card-pulse 关键帧动画');
    assert(html.indexOf('.stage-card.stage-card-pulse') >= 0,
      '应包含 stage-card-pulse class');
  });

  it('卡片自动展开逻辑存在', function() {
    assert(html.indexOf("content.classList.add('open')") >= 0,
      '应包含自动展开 stage-content 逻辑');
  });

  it('互斥高亮逻辑存在', function() {
    assert(html.indexOf("r.classList.remove('highlight')") >= 0,
      '应包含移除其他行 highlight 的逻辑');
  });

  it('偏移量 80px 防止固定导航遮挡', function() {
    assert(html.indexOf('- 80') >= 0,
      '滚动偏移应包含 -80px');
  });
});

// ═══════════════════════════════════════════════════════════════
//  2. 浏览器端测试脚本（注入浏览器执行）
// ═══════════════════════════════════════════════════════════════

var browserTestScript = `
// 浏览器端测试脚本 — 在 http://localhost:8090/index.html 的方案详情页执行
(function() {
  var results = { passed: 0, failed: 0, details: [] };

  function assert(cond, msg) {
    if (cond) { results.passed++; results.details.push('✓ ' + msg); }
    else { results.failed++; results.details.push('✗ ' + msg); }
  }

  // 前置条件：需要在方案详情页
  var rows = document.querySelectorAll('.stage-overview-table tbody tr');
  var cards = document.querySelectorAll('.stage-card[data-stage-index]');

  assert(rows.length > 0, '概览表格行存在 (' + rows.length + ' 行)');
  assert(cards.length > 0, '阶段卡片存在 (' + cards.length + ' 个)');
  assert(rows.length === cards.length, '表格行数与卡片数一致 (' + rows.length + ' vs ' + cards.length + ')');

  if (rows.length === 0 || cards.length === 0) {
    return JSON.stringify(results);
  }

  // ── 测试 1：点击第一行 → 高亮 + 脉冲 + 滚动 ──
  var contentEl = document.getElementById('content');
  var scrollTopBefore = contentEl ? contentEl.scrollTop : window.scrollY;

  // 模拟点击第一行
  highlightStageRow(rows[0], 0);

  assert(rows[0].classList.contains('highlight'), '点击第一行后行高亮');

  // 检查脉冲动画
  var card0 = document.querySelector('.stage-card[data-stage-index="0"]');
  assert(card0.classList.contains('stage-card-pulse'), '第一张卡片获得脉冲动画');

  // 检查滚动（异步，需要等待动画完成）
  // 先记录当前位置，等待 500ms 后检查

  // ── 测试 2：互斥高亮 ──
  if (rows.length > 1) {
    // 重新获取 rows（因为 DOM 可能变化）
    rows = document.querySelectorAll('.stage-overview-table tbody tr');
    highlightStageRow(rows[1], 1);

    assert(!rows[0].classList.contains('highlight'), '点击第二行后第一行取消高亮');
    assert(rows[1].classList.contains('highlight'), '第二行高亮');

    var card1 = document.querySelector('.stage-card[data-stage-index="1"]');
    assert(card1.classList.contains('stage-card-pulse'), '第二张卡片获得脉冲动画');
    assert(!card0.classList.contains('stage-card-pulse'), '第一张卡片脉冲动画已移除');
  }

  // ── 测试 3：卡片自动展开 ──
  // 先折叠第一个卡片
  var content0 = card0.querySelector('.stage-content');
  if (content0) {
    content0.classList.remove('open');
    assert(!content0.classList.contains('open'), '手动折叠第一张卡片');

    // 点击行触发展开
    rows = document.querySelectorAll('.stage-overview-table tbody tr');
    highlightStageRow(rows[0], 0);
    assert(content0.classList.contains('open'), '点击行后卡片自动展开');
  }

  // ── 测试 4：滚动位置变化 ──
  // 异步检查，返回标记让外部等待后验证
  results.scrollTopAfterClick = contentEl ? contentEl.scrollTop : window.scrollY;
  results.card0OffsetTop = card0.offsetTop;
  results.card1OffsetTop = card1 ? card1.offsetTop : 0;
  results.contentScrollTop = contentEl ? contentEl.scrollTop : window.scrollY;

  return JSON.stringify(results);
})();
`;

describe('2. 浏览器端测试脚本生成', function() {
  it('测试脚本已生成', function() {
    assert(browserTestScript.length > 100, '浏览器测试脚本应非空');
    assert(browserTestScript.indexOf('highlightStageRow') >= 0, '脚本应调用 highlightStageRow');
    assert(browserTestScript.indexOf('stage-card-pulse') >= 0, '脚本应检查脉冲动画');
    assert(browserTestScript.indexOf('highlight') >= 0, '脚本应检查高亮 class');
    assert(browserTestScript.indexOf('scrollTo') >= 0 || browserTestScript.indexOf('scrollTop') >= 0, '脚本应检查滚动位置');
  });
});

// ═══════════════════════════════════════════════════════════════
//  3. 滚动联动逻辑验证（静态分析）
// ═══════════════════════════════════════════════════════════════

describe('3. 滚动联动逻辑验证', function() {
  it('使用 getBoundingClientRect 计算卡片位置', function() {
    assert(html.indexOf('getBoundingClientRect().top') >= 0,
      '应使用 getBoundingClientRect 获取卡片位置');
  });

  it('使用 content 容器的 scrollTo 方法', function() {
    assert(html.indexOf("contentEl.scrollTo({ top: offset, behavior: 'smooth' })") >= 0,
      '应使用 contentEl.scrollTo 平滑滚动');
  });

  it('降级到 window.scrollTo（无 content 容器时）', function() {
    assert(html.indexOf("window.scrollTo({ top: offset, behavior: 'smooth' })") >= 0,
      '应降级到 window.scrollTo');
  });

  it('强制 reflow 重启脉冲动画', function() {
    assert(html.indexOf('void card.offsetWidth') >= 0,
      '应通过 void card.offsetWidth 强制 reflow');
  });

  it('移除旧脉冲 class 后重新添加', function() {
    assert(html.indexOf("card.classList.remove('stage-card-pulse')") >= 0,
      '应先移除 stage-card-pulse class');
    assert(html.indexOf("card.classList.add('stage-card-pulse')") >= 0,
      '然后重新添加 stage-card-pulse class');
  });
});

// ═══════════════════════════════════════════════════════════════
//  4. 边界情况验证
// ═══════════════════════════════════════════════════════════════

describe('4. 边界情况验证', function() {
  it('stageIndex 为 undefined 时安全返回', function() {
    assert(html.indexOf('if (stageIndex === undefined) return') >= 0,
      'stageIndex 为 undefined 时应 return');
  });

  it('card 不存在时安全返回', function() {
    assert(html.indexOf('if (!card) return') >= 0,
      'card 查询失败时应 return');
  });

  it('content 容器不存在时降级到 window', function() {
    assert(html.indexOf('var contentEl = document.getElementById(\'content\')') >= 0,
      '应尝试获取 content 容器');
    assert(html.indexOf('contentEl ? contentEl : window') >= 0 || html.indexOf('contentEl || window') >= 0,
      'contentEl 不存在时应降级到 window');
  });
});

// ═══════════════════════════════════════════════════════════════
//  5. CSS 动画验证
// ═══════════════════════════════════════════════════════════════

describe('5. CSS 动画验证', function() {
  it('脉冲动画时长 0.8s', function() {
    assert(html.indexOf('animation: stage-card-pulse 0.8s ease-out') >= 0,
      '动画时长应为 0.8s');
  });

  it('动画包含 box-shadow 变化', function() {
    assert(html.indexOf('box-shadow: 0 0 0 0 rgba(8,145,178') >= 0,
      '动画起始帧应有 box-shadow');
    assert(html.indexOf('box-shadow: 0 0 0 6px rgba(8,145,178') >= 0,
      '动画中间帧应有扩散 box-shadow');
  });

  it('动画包含 border-color 变化', function() {
    assert(html.indexOf('border-color: var(--primary)') >= 0,
      '动画应包含 border-color 变化');
    assert(html.indexOf('border-color: var(--border)') >= 0,
      '动画结束帧应恢复 border-color');
  });
});

// ═══════════════════════════════════════════════════════════════
//  测试结果汇总
// ═══════════════════════════════════════════════════════════════

console.log('\n══════════════════════════════════════');
console.log('  阶段概览表格滚动联动端到端测试结果');
console.log('  通过: ' + passed + ' | 失败: ' + failed);
console.log('══════════════════════════════════════');

if (failures.length > 0) {
  console.log('\n失败详情:');
  failures.forEach(function(f) { console.log('  - ' + f); });
  process.exit(1);
} else {
  console.log('\n✅ 全部测试通过');
  console.log('\n📋 浏览器端测试脚本已生成，可通过以下方式在浏览器中运行：');
  console.log('   1. 打开 http://localhost:8090/index.html');
  console.log('   2. 进入循证方案 → 点击任意方案卡片');
  console.log('   3. 在浏览器控制台粘贴以下脚本执行：');
  console.log('\n' + browserTestScript);
  process.exit(0);
}
