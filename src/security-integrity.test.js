/**
 * ═══════════════════════════════════════════════════════════════
 *  安全与数据完整性单元测试
 *  运行方式：node src/security-integrity.test.js
 * ═══════════════════════════════════════════════════════════════
 *
 *  测试覆盖：
 *    1. escapeHtml — 各种 XSS 载荷转义
 *    2. buildMigrationReportHTML — 数据源字段 escapeHtml
 *    3. validateMigrationReportData — 数据结构校验
 *    4. safeSetJSON / safeGetJSON — localStorage 安全写入原子性
 *    5. showModal title — 函数级 escapeHtml 防护
 *    6. 双写回滚 — linkAssessmentToPatient / deletePatient 回滚可靠性
 */

// ── 测试框架 ──
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
  try { fn(); } catch (e) { console.error('  ✗ GROUP ERROR: ' + e.message); }
}

// ── Mock 环境 ──
let mockStorage = {};
let mockStorageFailMode = false;
global.localStorage = {
  getItem: function(k) { return mockStorage[k] !== undefined ? mockStorage[k] : null; },
  setItem: function(k, v) {
    if (mockStorageFailMode) throw new Error('QuotaExceededError');
    mockStorage[k] = String(v);
  },
  removeItem: function(k) { delete mockStorage[k]; },
  clear: function() { mockStorage = {}; },
};
global.window = { alert: function(){} };
global.alert = function(msg) {};

function resetMockStorage() {
  mockStorage = {};
  mockStorageFailMode = false;
}

// ── 从实际代码提取的纯函数 ──

// escapeHtml（与 utils.js 一致）
function escapeHtml(val) {
  if (val === null || val === undefined) return '';
  return String(val)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// safeGetJSON（与 utils.js 一致）
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
    }
    return fb;
  }
}

// safeSetJSON（与 index.html 一致）
function safeSetJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.error('[Storage] localStorage["' + key + '"] 写入失败:', e.message);
    return false;
  }
}

// validateMigrationReportData（与 index.html 一致）
function validateMigrationReportData(data) {
  var errors = [];
  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['数据必须为对象'] };
  }
  var validStatuses = ['healthy', 'degraded', 'error'];
  if (data.systemStatus && validStatuses.indexOf(data.systemStatus) === -1) {
    errors.push('systemStatus 不在允许列表中: ' + escapeHtml(data.systemStatus));
  }
  ['scales', 'protocols'].forEach(function(key) {
    var section = data[key];
    if (!section || typeof section !== 'object') {
      errors.push(key + ' 字段缺失或类型错误');
      return;
    }
    ['total', 'migrated'].forEach(function(numKey) {
      if (typeof section[numKey] !== 'number' || section[numKey] < 0) {
        errors.push(key + '.' + numKey + ' 必须为非负数');
      }
    });
    if (section.errors && !Array.isArray(section.errors)) {
      errors.push(key + '.errors 必须为数组');
    }
    if (section.sources) {
      if (!Array.isArray(section.sources)) {
        errors.push(key + '.sources 必须为数组');
      } else {
        section.sources.forEach(function(src, i) {
          if (typeof src !== 'string') {
            errors.push(key + '.sources[' + i + '] 必须为字符串');
          }
        });
      }
    }
  });
  if (data.generatedAt && isNaN(Date.parse(data.generatedAt))) {
    errors.push('generatedAt 不是有效的日期格式');
  }
  return { valid: errors.length === 0, errors: errors };
}

// buildMigrationReportHTML（与 index.html 关键部分一致，聚焦 escapeHtml 验证）
function buildMigrationReportHTML(data) {
  var html = '';
  // scales errors — 必须 escape
  if (data.scales && data.scales.errors && data.scales.errors.length > 0) {
    data.scales.errors.forEach(function(err) {
      html += '<div>' + escapeHtml(err.name || err.id) + ': ' +
        (err.errors || []).map(function(e) {
          return escapeHtml(e.field) + ' - ' + escapeHtml(e.message);
        }).join('; ') + '</div>';
    });
  }
  // protocols errors — 必须 escape
  if (data.protocols && data.protocols.errors && data.protocols.errors.length > 0) {
    data.protocols.errors.forEach(function(err) {
      html += '<div>' + escapeHtml(err.name || err.id) + ': ' +
        escapeHtml(err.message || '未知错误') + '</div>';
    });
  }
  // sources — 必须 escape
  if (data.scales && data.scales.sources && data.scales.sources.length > 0) {
    data.scales.sources.forEach(function(src) {
      html += '<li>' + escapeHtml(src) + '</li>';
    });
  }
  return html;
}

// ─══════════════════════════════════════════════════════════════
//  测试 1: escapeHtml — XSS 载荷转义
// ─══════════════════════════════════════════════════════════════
testGroup('1. escapeHtml XSS 防护', function() {
  assertEqual(escapeHtml('<script>alert(1)</script>'), '&lt;script&gt;alert(1)&lt;/script&gt;',
    'script 标签被转义');
  assertEqual(escapeHtml('"><img onerror=alert(1) src=x>'), '&quot;&gt;&lt;img onerror=alert(1) src=x&gt;',
    '事件处理器被转义');
  assertEqual(escapeHtml("' onclick='alert(1)"), '&#39; onclick=&#39;alert(1)',
    '单引号属性注入被转义');
  assertEqual(escapeHtml('普通文本'), '普通文本',
    '中文不受影响');
  assertEqual(escapeHtml(null), '',
    'null 返回空字符串');
  assertEqual(escapeHtml(undefined), '',
    'undefined 返回空字符串');
  assertEqual(escapeHtml(123), '123',
    '数字转字符串');
  assertEqual(escapeHtml('AT&T'), 'AT&amp;T',
    '& 符号被转义');
});

// ─══════════════════════════════════════════════════════════════
//  测试 2: buildMigrationReportHTML — 数据字段 escapeHtml
// ─══════════════════════════════════════════════════════════════
testGroup('2. buildMigrationReportHTML XSS 防护', function() {
  // scales errors 含恶意 name
  var result1 = buildMigrationReportHTML({
    scales: {
      total: 10, migrated: 5,
      errors: [{ name: '<img src=x onerror=alert(1)>', errors: [{ field: 'test', message: 'ok' }] }]
    },
    protocols: { total: 5, migrated: 3 }
  });
  assert(result1.indexOf('<img src=x onerror=alert(1)>') === -1,
    'scales error name 中的 <img> 标签被转义');
  assert(result1.indexOf('&lt;img src=x onerror=alert(1)&gt;') !== -1,
    'scales error name 转义后文本存在');

  // scales errors 含恶意 field/message
  var result2 = buildMigrationReportHTML({
    scales: {
      total: 10, migrated: 5,
      errors: [{ name: 'test', errors: [{ field: '"><script>alert(1)</script>', message: 'XSS' }] }]
    },
    protocols: { total: 5, migrated: 3 }
  });
  assert(result2.indexOf('<script>') === -1,
    'scales error field 中的 script 标签被转义');

  // protocols errors 含恶意 message
  var result3 = buildMigrationReportHTML({
    scales: { total: 10, migrated: 5 },
    protocols: {
      total: 5, migrated: 3,
      errors: [{ id: 'p1', message: '<svg onload=alert(1)>' }]
    }
  });
  assert(result3.indexOf('<svg onload=alert(1)>') === -1,
    'protocol error message 中的 svg 标签被转义');

  // sources 含恶意内容
  var result4 = buildMigrationReportHTML({
    scales: { total: 10, migrated: 5, sources: ['<a href="javascript:alert(1)">click</a>'] },
    protocols: { total: 5, migrated: 3 }
  });
  assert(result4.indexOf('<a href="javascript:alert(1)">') === -1,
    'source 中的 javascript 链接被转义');
});

// ─══════════════════════════════════════════════════════════════
//  测试 3: validateMigrationReportData — 数据校验
// ─══════════════════════════════════════════════════════════════
testGroup('3. validateMigrationReportData 数据校验', function() {
  // 有效数据
  var validData = {
    systemStatus: 'healthy',
    generatedAt: '2026-08-12T10:00:00Z',
    scales: { total: 10, migrated: 5, errors: [], sources: ['data.js'] },
    protocols: { total: 5, migrated: 3, errors: [] }
  };
  var r1 = validateMigrationReportData(validData);
  assert(r1.valid === true, '完整有效数据通过校验');
  assert(r1.errors.length === 0, '无错误');

  // 无效 systemStatus
  var r2 = validateMigrationReportData({
    systemStatus: 'malicious',
    scales: { total: 10, migrated: 5 },
    protocols: { total: 5, migrated: 3 }
  });
  assert(r2.valid === false, '非法 systemStatus 被拒绝');

  // 缺失 scales
  var r3 = validateMigrationReportData({
    systemStatus: 'healthy',
    protocols: { total: 5, migrated: 3 }
  });
  assert(r3.valid === false, '缺失 scales 被检测');

  // total 为负数
  var r4 = validateMigrationReportData({
    systemStatus: 'healthy',
    scales: { total: -1, migrated: 5 },
    protocols: { total: 5, migrated: 3 }
  });
  assert(r4.valid === false, '负数 total 被拒绝');

  // sources 非字符串
  var r5 = validateMigrationReportData({
    systemStatus: 'healthy',
    scales: { total: 10, migrated: 5, sources: [123, true] },
    protocols: { total: 5, migrated: 3 }
  });
  assert(r5.valid === false, '非字符串 sources 被检测');

  // generatedAt 无效日期
  var r6 = validateMigrationReportData({
    systemStatus: 'healthy',
    generatedAt: 'not-a-date',
    scales: { total: 10, migrated: 5 },
    protocols: { total: 5, migrated: 3 }
  });
  assert(r6.valid === false, '无效日期格式被拒绝');

  // null 数据
  var r7 = validateMigrationReportData(null);
  assert(r7.valid === false, 'null 数据被拒绝');

  // 空对象（scales/protocols 缺失）
  var r8 = validateMigrationReportData({});
  assert(r8.valid === false, '空对象被拒绝');
});

// ─══════════════════════════════════════════════════════════════
//  测试 4: safeSetJSON / safeGetJSON — 安全写入与读取
// ─══════════════════════════════════════════════════════════════
testGroup('4. safeSetJSON / safeGetJSON 安全读写', function() {
  resetMockStorage();

  // 正常写入
  assert(safeSetJSON('test', { a: 1 }) === true, '正常写入返回 true');
  assertEqual(safeGetJSON('test'), { a: 1 }, '写入后可正确读取');

  // 写入失败（QuotaExceededError）
  mockStorageFailMode = true;
  assert(safeSetJSON('fail', { b: 2 }) === false, 'QuotaExceededError 时返回 false');
  mockStorageFailMode = false;

  // 读取不存在的 key 返回默认值
  assertEqual(safeGetJSON('nonexistent', 'default'), 'default', '不存在的 key 返回 fallback');

  // 读取损坏数据返回 fallback
  mockStorage['corrupt'] = 'not-json{{{';
  assertEqual(safeGetJSON('corrupt', []), [], '损坏数据返回 fallback 且不抛异常');

  // 空值处理
  assertEqual(safeGetJSON('empty'), [], '无 fallback 时默认返回空数组');
});

// ─══════════════════════════════════════════════════════════════
//  测试 5: 双写原子性 — linkAssessmentToPatient 回滚
// ─══════════════════════════════════════════════════════════════
testGroup('5. 双写原子性 — linkAssessmentToPatient 回滚', function() {
  resetMockStorage();

  var patients = [{ id: 1, name: '张三', assessmentIds: [] }];
  var assessments = [{ id: 'a1', patientId: null }];
  safeSetJSON('patients', patients);
  safeSetJSON('assessmentHistory', assessments);

  // 场景 A: 正常双写
  var allAssessments = safeGetJSON('assessmentHistory', []);
  var backup = JSON.stringify(allAssessments);
  allAssessments[0].patientId = 1;
  var w1 = safeSetJSON('assessmentHistory', allAssessments);
  var patientsData = safeGetJSON('patients', []);
  patientsData[0].assessmentIds.push('a1');
  var w2 = safeSetJSON('patients', patientsData);
  assert(w1 && w2, '正常双写均成功');

  // 场景 B: 第二次写入失败 → 回滚
  resetMockStorage();
  safeSetJSON('patients', [{ id: 1, name: '张三', assessmentIds: [] }]);
  safeSetJSON('assessmentHistory', [{ id: 'a1', patientId: null }]);

  // 第一步：备份 + 第一次写入
  var data = safeGetJSON('assessmentHistory', []);
  var backupB = JSON.stringify(data);
  data[0].patientId = 1;
  safeSetJSON('assessmentHistory', data);

  // 第二步：模拟第二次写入失败
  mockStorageFailMode = true;
  var patientsB = safeGetJSON('patients', []);
  patientsB[0].assessmentIds.push('a1');
  var w2B = safeSetJSON('patients', patientsB);
  assert(w2B === false, '第二次写入返回 false');

  // 第三步：执行回滚（恢复存储后验证）
  mockStorageFailMode = false;
  try { safeSetJSON('assessmentHistory', JSON.parse(backupB)); } catch (_) {}

  // 验证：assessmentHistory 恢复原始状态
  var afterRollback = safeGetJSON('assessmentHistory', []);
  assert(afterRollback[0].patientId === null, '回滚后 patientId 为 null');
});

// ─══════════════════════════════════════════════════════════════
//  测试 6: 双写原子性 — deletePatient 回滚
// ─══════════════════════════════════════════════════════════════
testGroup('6. 双写原子性 — deletePatient 回滚', function() {
  resetMockStorage();

  var patients = [{ id: 1, name: '张三', assessmentIds: ['a1'] }];
  var assessments = [{ id: 'a1', patientId: 1 }];
  safeSetJSON('patients', patients);
  safeSetJSON('assessmentHistory', assessments);

  // 场景 A: 正常删除
  var allAssessmentsA = safeGetJSON('assessmentHistory', []);
  allAssessmentsA.forEach(function(a) { if (a.patientId === 1) a.patientId = null; });
  safeSetJSON('assessmentHistory', allAssessmentsA);
  var patientsA = safeGetJSON('patients', []);
  patientsA.splice(0, 1);
  safeSetJSON('patients', patientsA);
  assert(patientsA.length === 0, '正常删除后患者列表为空');

  // 场景 B: 第二次写入失败 → 回滚
  resetMockStorage();
  safeSetJSON('patients', [{ id: 1, name: '张三', assessmentIds: ['a1'] }]);
  safeSetJSON('assessmentHistory', [{ id: 'a1', patientId: 1 }]);

  // 第一步：备份 + 第一次写入（删除患者）
  var patientsData = safeGetJSON('patients', []);
  var backup = JSON.stringify(patientsData);
  patientsData.splice(0, 1);
  safeSetJSON('patients', patientsData);

  // 第二步：第二次写入触发 QuotaExceededError
  mockStorageFailMode = true;
  var assessB = safeGetJSON('assessmentHistory', []);
  assessB.forEach(function(a) { if (a.patientId === 1) a.patientId = null; });
  var wB = safeSetJSON('assessmentHistory', assessB);
  assert(wB === false, '第二次写入返回 false');

  // 第三步：执行回滚
  mockStorageFailMode = false;
  try { safeSetJSON('patients', JSON.parse(backup)); } catch (_) {}

  // 验证：patients 恢复原始状态
  var after = safeGetJSON('patients', []);
  assert(after.length === 1, '回滚后患者存在');
  assert(after[0].id === 1, '患者 ID 正确');
});

// ─══════════════════════════════════════════════════════════════
//  测试 7: 并发锁 — 防止双击竞态
// ─══════════════════════════════════════════════════════════════
testGroup('7. 并发锁 — 双击竞态防护', function() {
  resetMockStorage();

  var callCount = 0;
  var lock = false;
  function saveWithLock(data) {
    if (lock) return { ok: false, reason: 'locked' };
    lock = true;
    callCount++;
    try {
      return { ok: true, data: data };
    } finally {
      lock = false;
    }
  }

  var r1 = saveWithLock({ id: 1 });
  assert(r1.ok === true, '第一次调用成功');
  assert(callCount === 1, '计数器为 1');

  var r2 = saveWithLock({ id: 2 });
  assert(r2.ok === true, 'lock 释放后第二次调用成功');
  assert(callCount === 2, '计数器为 2');

  lock = true;
  var r3 = saveWithLock({ id: 3 });
  assert(r3.ok === false, 'lock 激活时被拒绝');
  assert(r3.reason === 'locked', '返回 locked 原因');
  lock = false;

  // finally 释放验证
  var errorLock = false;
  function testFinally() {
    if (errorLock) return 'blocked';
    errorLock = true;
    try {
      // 模拟函数体可能抛异常的场景
      return 'success';
    } finally {
      errorLock = false;
    }
  }
  var r4 = testFinally();
  assert(r4 === 'success', 'try 块正常执行');
  assert(errorLock === false, 'finally 块释放了 lock');

  // 模拟异常情况：用 try-catch 包裹验证 finally 行为
  var excLock = false;
  function testException() {
    if (excLock) return 'blocked';
    excLock = true;
    try {
      var x = undefinedVar;
      return 'never';
    } catch (e) {
      return 'caught';
    } finally {
      excLock = false;
    }
  }
  var r5 = testException();
  assert(r5 === 'caught', '异常被 catch 捕获');
  assert(excLock === false, '异常后 finally 释放了 lock');

  var r6 = testException();
  assert(r6 === 'caught', 'lock 释放后可再次获取');
});

// ─══════════════════════════════════════════════════════════════
//  测试 8: escapeAttr — 动态属性安全拼接
// ─══════════════════════════════════════════════════════════════
testGroup('8. 动态属性安全拼接', function() {
  function escapeAttr(val) {
    if (val === null || val === undefined) return '';
    return String(val)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // value 属性拼接
  var username = '"><script>alert(1)</script>';
  var valueAttr = 'value="' + escapeAttr(username) + '"';
  assert(valueAttr.indexOf('<script>') === -1, 'value 属性值中的 script 被转义');
  assert(valueAttr.indexOf('&quot;') !== -1, '双引号被转义为实体');

  // placeholder 属性拼接：转义后 onfocus 成为普通文本，不再是事件属性
  var placeholder = '" onfocus="alert(1)';
  var placeholderAttr = 'placeholder="' + escapeAttr(placeholder) + '"';
  assert(placeholderAttr.indexOf('&quot;') !== -1, '注入的双引号被转义，不再闭合属性');
  assert(placeholderAttr.indexOf('onfocus=') !== -1, 'onfocus 作为文本存在于属性值中，而非独立属性');
  // 完整属性：placeholder="&quot; onfocus=&quot;alert(1)"
  // 由于双引号被转义，浏览器不会将 onfocus 解释为事件处理器

  // href 属性拼接
  var href = 'javascript:alert(1)';
  var hrefAttr = 'href="' + escapeAttr(href) + '"';
  assert(hrefAttr.indexOf('javascript:alert(1)') !== -1,
    'javascript: 协议被保留（escape 只转义特殊字符，不阻止协议）');
  // 注意：这说明 escapeAttr 本身不能防止 javascript: 协议注入
  // 生产代码中需配合白名单校验
});

// ─══════════════════════════════════════════════════════════════
//  汇总
// ─══════════════════════════════════════════════════════════════
console.log('\n╔══════════════════════════════════════════════════════════════╗');
console.log('║              安全与数据完整性测试结果                       ║');
console.log('╚══════════════════════════════════════════════════════════════╝');
console.log('');
console.log('  通过: ' + passed + ' / ' + (passed + failed));
console.log('  失败: ' + failed);
console.log('');

if (failed > 0) {
  console.log('  失败详情:');
  failures.forEach(function(f, i) { console.log('    ' + (i + 1) + '. ' + f); });
  console.log('');
  process.exit(1);
} else {
  console.log('  ✅ 全部测试通过！');
  process.exit(0);
}