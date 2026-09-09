/**
 * ═══════════════════════════════════════════════════════════════
 *  动作素材匹配逻辑测试（第 5 批：exercise-media.js）
 * ═══════════════════════════════════════════════════════════════
 *
 *  运行方式：node test/exercise-media.test.js
 *
 *  测试覆盖：
 *    A. 结构完整性（structural）
 *       - index.html 已引用 exercise-media.js 且位于 protocols-tools-guidelines.js 之前
 *       - sw.js 缓存清单包含 exercise-media.js
 *       - build_single.py 复制清单包含 exercise-media.js
 *       - protocols-tools-guidelines.js 调用 findForAction 且暴露 emTogglePlay
 *    B. exerciseMedia.findForAction 纯函数（functional）
 *       1. 单一关键词命中
 *       2. 多关键词累加得分
 *       3. 关键词长度权重（越长越具体）
 *       4. 同分时专指度决胜（关键词数更少者优先）
 *       5. 英文关键词（ACL / BOSU）
 *       6. 大小写不敏感
 *       7. 无关键词文本返回 null（剂量/随访类）
 *       8. 纯空白/空串返回 null
 *       9. null / undefined / 非字符串安全返回 null
 *      10. 中部子串匹配（动作名带括号后缀）
 *      11. 命中结果必含 name/path/match 字段
 *    C. 资源一致性与完整性（assets 联动）
 *       - listAll 返回条数与清单一致且为副本
 *       - 所有 path 在 assets/illustrations/ 下真实存在
 *       - 无重复 path / 重复 name
 *    D. emTogglePlay 动效控制（mock DOM）
 *       - 无参安全返回
 *       - 播放：添加 em-playing、按钮禁用、文本切换
 *       - 重复触发被拦截
 *       - 定时结束后恢复
 */

// ═══════════════════════════════════════════════════════════════
//  测试框架（与 test/scale-filter.test.js 保持一致的轻量自建框架）
// ═══════════════════════════════════════════════════════════════

var passed = 0, failed = 0;
var failures = [];

function assert(condition, message) {
  if (condition) { passed++; }
  else { failed++; failures.push(message); console.error('  ✗ FAIL: ' + message); }
}

function describe(name, fn) { console.log('\n▸ ' + name); fn(); }

function it(name, fn) {
  process.stdout.write('  ' + name + ' ... ');
  var beforeFailed = failed;
  try { fn(); }
  catch (e) {
    failed++; failures.push(name + ' (异常: ' + e.message + ')');
    console.error('\n  ✗ 异常: ' + e.message);
  }
  if (failed === beforeFailed) console.log('✓');
}

// ═══════════════════════════════════════════════════════════════
//  加载被测模块（exercise-media.js 挂到 window，Node 下模拟）
// ═══════════════════════════════════════════════════════════════

var fs = require('fs');
var path = require('path');

global.window = global;
require(path.join(__dirname, '..', 'src', 'exercise-media.js'));

var exerciseMedia = global.exerciseMedia;
var emTogglePlay = global.emTogglePlay;

var srcFile = fs.readFileSync(path.join(__dirname, '..', 'src', 'exercise-media.js'), 'utf-8');

// ═══════════════════════════════════════════════════════════════════════════
//  A. 结构完整性（接入链路）
// ═══════════════════════════════════════════════════════════════════════════

describe('A. 接入链路结构完整性', function () {
  var indexHtml = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf-8');
  var sw = fs.readFileSync(path.join(__dirname, '..', 'sw.js'), 'utf-8');
  var buildPy = fs.readFileSync(path.join(__dirname, '..', 'build_single.py'), 'utf-8');
  var protoJs = fs.readFileSync(path.join(__dirname, '..', 'src', 'protocols-tools-guidelines.js'), 'utf-8');

  it('index.html 已引用 src/exercise-media.js', function () {
    assert(indexHtml.indexOf('src/exercise-media.js') >= 0, 'index.html 应包含 <script src="src/exercise-media.js">');
  });

  it('exercise-media.js 在 protocols-tools-guidelines.js 之前加载', function () {
    var emPos = indexHtml.indexOf('src/exercise-media.js');
    var pPos = indexHtml.indexOf('src/protocols-tools-guidelines.js');
    assert(emPos >= 0 && pPos >= 0 && emPos < pPos,
      'exercise-media.js 位置(' + emPos + ') 应先于 protocols-tools-guidelines.js 位置(' + pPos + ')');
  });

  it('sw.js 缓存清单包含 exercise-media.js', function () {
    assert(sw.indexOf('src/exercise-media.js') >= 0, 'sw.js 应预缓存 exercise-media.js');
  });

  it('build_single.py 复制清单包含 exercise-media.js', function () {
    assert(buildPy.indexOf('src/exercise-media.js') >= 0, 'build_single.py 应复制 exercise-media.js');
  });

  it('protocols-tools-guidelines.js 调用 exerciseMedia.findForAction', function () {
    assert(protoJs.indexOf('window.exerciseMedia') >= 0 && protoJs.indexOf('findForAction') >= 0,
      '方案详情渲染应调用 exerciseMedia.findForAction');
    assert(protoJs.indexOf('teach-media') >= 0, '应渲染 teach-media 动效卡片 HTML');
  });

  it('exercise-media.js 暴露 findForAction / listAll / emTogglePlay', function () {
    assert(typeof exerciseMedia.findForAction === 'function', 'exerciseMedia.findForAction 应为函数');
    assert(typeof exerciseMedia.listAll === 'function', 'exerciseMedia.listAll 应为函数');
    assert(typeof emTogglePlay === 'function', 'emTogglePlay 应为全局函数');
  });
});

// ═══════════════════════════════════════════════════════════════════════════
//  B. findForAction 纯函数功能测试
// ═══════════════════════════════════════════════════════════════════════════

describe('B. findForAction 关键字匹配', function () {

  it('1. 单一关键词命中（踝泵 → 踝练习）', function () {
    var r = exerciseMedia.findForAction('踝关节泵式运动（踝泵）');
    assert(r && r.name === '踝练习', '应命中"踝练习"，实际 ' + (r && r.name));
    assert(r.path === 'assets/illustrations/rehab-ankle-exercise.webp', '路径应为 rehab-ankle-exercise.webp，实际 ' + r.path);
  });

  it('2. 多关键词累加得分（弹力带+抗阻 → 弹力带抗阻）', function () {
    var r = exerciseMedia.findForAction('弹力带抗阻外旋训练');
    assert(r && r.name === '弹力带抗阻', '应命中"弹力带抗阻"，实际 ' + (r && r.name));
  });

  it('3. 关键词长度权重：越长越具体', function () {
    // "股四头" (3) 比 "膝" (1) 权重高
    var r = exerciseMedia.findForAction('股四头肌等长收缩');
    assert(r && r.name === '膝康复', '应命中"膝康复"，实际 ' + (r && r.name));
  });

  it('4. 同分时专指度决胜（泡沫轴放松腘绳肌 → 泡沫轴，而非膝康复）', function () {
    var r = exerciseMedia.findForAction('泡沫轴放松腘绳肌');
    assert(r && r.name === '泡沫轴', '应命中"泡沫轴"（更专指），实际 ' + (r && r.name));
    assert(r.path === 'assets/illustrations/rehab-foam-roller.webp', '路径应为 foam-roller');
  });

  it('5. 英文关键词命中（ACL → 膝康复；BOSU → BOSU 本体感觉）', function () {
    var r1 = exerciseMedia.findForAction('ACL 重建术后第一阶段的训练');
    assert(r1 && r1.name === '膝康复', 'ACL 应命中"膝康复"，实际 ' + (r1 && r1.name));
    var r2 = exerciseMedia.findForAction('BOSU 半圆球上单腿站立训练');
    assert(r2 && r2.name === 'BOSU 本体感觉', 'BOSU 应命中"BOSU 本体感觉"，实际 ' + (r2 && r2.name));
  });

  it('5b. 防误配：普通单腿站立不因"单腿"词命中 BOSU', function () {
    var r = exerciseMedia.findForAction('平地单腿站立平衡训练');
    assert(r && r.name === '单腿站立', '无 BOSU 语境应命中"单腿站立"，实际 ' + (r && r.name));
  });

  it('6. 大小写不敏感（acl/ACL/Acl 结果一致）', function () {
    var a = exerciseMedia.findForAction('acl 术后训练');
    var b = exerciseMedia.findForAction('ACL 术后训练');
    var c = exerciseMedia.findForAction('Acl 术后训练');
    assert(a && b && c, '三种大小写均应有命中');
    assert(a.path === b.path && b.path === c.path, '三种大小写应命中同一插图');
  });

  it('7. 无关键词文本返回 null（剂量/随访类不假命中）', function () {
    var r1 = exerciseMedia.findForAction('每日2-3组，每组5次');
    var r2 = exerciseMedia.findForAction('每2周随访1次');
    var r3 = exerciseMedia.findForAction('上楼健侧先上、下楼患侧先下');
    assert(r1 === null && r2 === null && r3 === null, '剂量/随访/转移类文本不应命中任何插图');
  });

  it('8. 纯空白 / 空字符串返回 null', function () {
    assert(exerciseMedia.findForAction('') === null, '空字符串应返回 null');
    assert(exerciseMedia.findForAction('   ') === null, '纯空白应返回 null');
  });

  it('9. null / undefined / 非字符串安全返回 null', function () {
    assert(exerciseMedia.findForAction(null) === null, 'null 应返回 null');
    assert(exerciseMedia.findForAction(undefined) === null, 'undefined 应返回 null');
    assert(exerciseMedia.findForAction(123) === null, '数字应返回 null');
    assert(exerciseMedia.findForAction({ text: '踝泵' }) === null, '对象应返回 null');
  });

  it('10. 中部子串匹配（动作名带括号后缀）', function () {
    var r = exerciseMedia.findForAction('直腿抬高（30-45°，保持后缓慢放下）');
    assert(r && r.name === '膝康复', '"直腿抬高"后缀文本应命中"膝康复"，实际 ' + (r && r.name));
  });

  it('11. 命中结果必含 name / path / match 字段', function () {
    var r = exerciseMedia.findForAction('单腿站立平衡训练');
    assert(r && typeof r.name === 'string' && r.name.length > 0, '应包含非空 name');
    assert(r && typeof r.path === 'string' && r.path.length > 0, '应包含非空 path');
    assert(r && typeof r.match === 'number' && r.match > 0, 'match 应为正数，实际 ' + (r && r.match));
  });
});

// ═══════════════════════════════════════════════════════════════════════════
//  C. 资源一致性与完整性（assets 联动）
// ═══════════════════════════════════════════════════════════════════════════

describe('C. 插图资源一致性', function () {

  it('1. listAll 返回 21 条可用插图', function () {
    var all = exerciseMedia.listAll();
    assert(Array.isArray(all) && all.length === 21, '应有 21 条插图，实际 ' + all.length);
  });

  it('2. 每条 path 在 assets/illustrations/ 下真实存在', function () {
    var all = exerciseMedia.listAll();
    var missing = all.filter(function (m) {
      return !fs.existsSync(path.join(__dirname, '..', m.path));
    });
    assert(missing.length === 0, '以下插图文件不存在: ' + missing.map(function (m) { return m.path; }).join(', '));
  });

  it('3. 无重复 path 与重复 name', function () {
    var all = exerciseMedia.listAll();
    var paths = all.map(function (m) { return m.path; });
    var names = all.map(function (m) { return m.name; });
    assert(new Set(paths).size === paths.length, 'path 不应重复');
    assert(new Set(names).size === names.length, 'name 不应重复');
  });

  it('4. listAll 返回副本，不泄漏内部引用', function () {
    var all = exerciseMedia.listAll();
    all.forEach(function (m) {
      m.keywords.push('被篡改');
      m.path = 'hacked';
      m.name = 'hacked';
    });
    var again = exerciseMedia.listAll();
    assert(again.every(function (m) { return m.path.indexOf('hacked') < 0 && m.name !== 'hacked'; }),
      '篡改返回值不应影响后续调用');
    // findForAction 仍正常
    var r = exerciseMedia.findForAction('踝关节泵式运动');
    assert(r && r.path === 'assets/illustrations/rehab-ankle-exercise.webp', '篡改后 findForAction 仍应返回原始 path');
  });

  it('5. 每个命中路径都可被 listAll 溯源', function () {
    var allPaths = exerciseMedia.listAll().map(function (m) { return m.path; });
    ['踝关节泵式运动', '泡沫轴放松腘绳肌', '股四头肌等长收缩', '单腿站立平衡训练'].forEach(function (t) {
      var r = exerciseMedia.findForAction(t);
      assert(r && allPaths.indexOf(r.path) >= 0, '命中路径应存在于清单: ' + t + ' -> ' + (r && r.path));
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════
//  D. emTogglePlay 动效控制（mock DOM）
// ═══════════════════════════════════════════════════════════════════════════

describe('D. emTogglePlay 动效控制', function () {

  function mockFrame() {
    return {
      classList: { _set: {}, add: function (c) { this._set[c] = true; }, remove: function (c) { delete this._set[c]; }, contains: function (c) { return !!this._set[c]; } }
    };
  }

  it('1. 无参调用安全返回', function () {
    // 不抛异常即可
    emTogglePlay(null);
    emTogglePlay(undefined);
    assert(true, '无参调用不应抛异常');
  });

  it('2. 播放后添加 em-playing、按钮禁用并切换文本', function () {
    var frame = mockFrame();
    var btn = {
      textContent: '',
      disabled: false,
      closest: function () { return { querySelector: function () { return frame; } }; }
    };
    emTogglePlay(btn);
    assert(frame.classList.contains('em-playing'), 'frame 应添加 em-playing');
    assert(btn.disabled === true, '按钮应禁用');
    assert(btn.textContent.indexOf('播放中') >= 0, '按钮文本应切换为"播放中"');
  });

  it('3. 播放期间重复触发被拦截', function () {
    var frame = mockFrame();
    var callCount = 0;
    var btn = {
      textContent: '',
      disabled: false,
      closest: function () { return { querySelector: function () { return frame; } }; }
    };
    emTogglePlay(btn);
    emTogglePlay(btn); // 第二次应被拦截
    assert(btn.disabled === true, '重复触发不应解除禁用');
    assert(btn.textContent.indexOf('播放中') >= 0, '重复触发文本应保持播放中');
  });

  it('4. 动画结束后自动恢复（结构性：存在定时还原逻辑）', function () {
    assert(srcFile.indexOf('setTimeout') >= 0, '源码应使用 setTimeout 控制动画时长');
    assert(srcFile.indexOf('1200') >= 0, '动画时长应为 1200ms');
    assert(srcFile.indexOf("classList.remove('em-playing')") >= 0, '结束时应移除 em-playing');
    assert(srcFile.indexOf("btn.textContent = '▶ 播放动效'") >= 0, '结束时按钮文本应恢复');
    assert(srcFile.indexOf('btn.disabled = false') >= 0, '结束时按钮应恢复可用');
  });

  it('5. closest 存在但未找到 frame 时安全返回', function () {
    var btn = {
      textContent: '',
      disabled: false,
      closest: function () { return { querySelector: function () { return null; } }; }
    };
    emTogglePlay(btn);
    assert(btn.disabled === false, '未找到 frame 不应修改按钮状态');
    assert(btn.textContent === '', '未找到 frame 不应修改按钮文本');
  });
});

// ═══════════════════════════════════════════════════════════════
//  测试结果汇总
// ═══════════════════════════════════════════════════════════════

console.log('\n══════════════════════════════════════');
console.log('  动作素材匹配逻辑测试结果');
console.log('  通过: ' + passed + ' | 失败: ' + failed);
console.log('══════════════════════════════════════');

if (failures.length > 0) {
  console.log('\n失败详情:');
  failures.forEach(function (f) { console.log('  - ' + f); });
  process.exit(1);
} else {
  console.log('\n✅ 全部测试通过');
  process.exit(0);
}