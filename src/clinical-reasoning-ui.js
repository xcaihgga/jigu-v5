/**
 * 临床推理 UI（第 3 批）
 * 数据来源：window.clinicalReasoning（clinical-reasoning.js）
 * 三个区块：鉴别路径 / 决策树 / 案例库，Tab 切换显示
 *
 * 关联依赖（全局）：
 *   - router.js:      switchTab
 *   - protocols-tools-guidelines.js: showProtocolDetail(id)
 *   - index.html:     renderScaleList / currentScaleCategory / scaleSearch / assessmentScales
 */
(function (global) {
  'use strict';

  var ACTIVE_TAB = 'diff';

  // 本地转义工具（兜底：即便 utils.js 未加载也不在模板里输出原始注入载荷）
  var esc = typeof escapeHtml === 'function'
    ? escapeHtml
    : function (v) { return v == null ? '' : String(v).replace(/[&<>"']/g, function (m) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m]; }); };
  var escA = typeof escapeAttr === 'function'
    ? escapeAttr
    : function (v) { return v == null ? '' : String(v).replace(/[&<>"'`]/g, function (m) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '`': '&#96;' })[m]; }); };

  // ─────────── 工具：动作引用解析（protocol:xxx / scale:xxx） ───────────
  function scaleNameById(id) {
    var list = typeof assessmentScales !== 'undefined' ? assessmentScales
      : (typeof scales !== 'undefined' ? scales : []);
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === id) return list[i].name || id;
    }
    return id;
  }

  /** 跳转到量表库并定位到指定量表 */
  function crGoScale(id) {
    var name = scaleNameById(id);
    if (typeof switchTab === 'function') switchTab('assessment');
    var el = document.getElementById('scaleSearch');
    if (el) el.value = name;
    try { if (typeof currentScaleCategory !== 'undefined') currentScaleCategory = '全部'; } catch (e) {}
    if (typeof renderScaleList === 'function') renderScaleList();
  }

  function actionLink(action) {
    if (!action) return '';
    if (action.indexOf('protocol:') === 0) {
      var pid = action.slice('protocol:'.length);
      return '<span class="cr-link" onclick="showProtocolDetail(\'' + escA(pid) + '\')">查看方案 ›</span>';
    }
    if (action.indexOf('scale:') === 0) {
      var sid = action.slice('scale:'.length);
      return '<span class="cr-link" onclick="crGoScale(\'' + escA(sid) + '\')">查看量表 ›</span>';
    }
    return '<span class="cr-link">' + esc(action) + '</span>';
  }

  // ─────────── 1. 鉴别路径 ───────────
  function renderDifferentials() {
    var box = document.getElementById('crDiffList');
    if (!box) return;
    var data = (global.clinicalReasoning || {}).differentials || [];
    box.innerHTML = data.map(function (d, i) {
      var rows = d.compareItems.map(function (c) {
        return '<tr>' +
          '<td class="cr-test">' + esc(c.test) + '</td>' +
          '<td class="cr-a">' + esc(c.a) + '</td>' +
          '<td class="cr-b">' + esc(c.b) + '</td>' +
          '<td class="cr-src">' + esc(c.source || '') + '</td>' +
        '</tr>';
      }).join('');
      return '<div class="cr-card">' +
        '<div class="cr-card-head" onclick="crToggle(\'' + escA(d.id) + '\')">' +
          '<span class="cr-num">' + (i + 1) + '</span>' +
          '<span class="cr-title">' + esc(d.title) + '</span>' +
          '<span class="cr-toggle" data-t="' + escA(d.id) + '">▸</span>' +
        '</div>' +
        '<div class="cr-card-body" id="cr-body-' + escA(d.id) + '">' +
          '<p class="cr-context">' + esc(d.context) + '</p>' +
          '<div class="cr-table-wrap">' +
            '<table class="cr-table"><thead><tr>' +
              '<th>查体/特征</th><th class="cr-col-a">鉴别 A</th><th class="cr-col-b">鉴别 B</th><th>来源</th>' +
            '</tr></thead><tbody>' + rows + '</tbody></table>' +
          '</div>' +
          '<div class="cr-conclusion"><span class="cr-conclusion-label">结论</span>' + esc(d.conclusion) + '</div>' +
          '<div class="cr-evidence">来源：' + esc(d.evidenceSource) + '</div>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  // ─────────── 2. 决策树 ───────────
  function renderDecisionTrees() {
    var box = document.getElementById('crTreeList');
    if (!box) return;
    var data = (global.clinicalReasoning || {}).decisionTrees || [];
    box.innerHTML = data.map(function (t, i) {
      var branches = t.branches.map(function (b, bi) {
        return '<div class="cr-branch">' +
          '<div class="cr-branch-node cr-branch-condition"><span class="cr-branch-label">若</span>' + esc(b.condition) + '</div>' +
          '<div class="cr-branch-arrow">↓</div>' +
          '<div class="cr-branch-node cr-branch-decision">' +
            '<span class="cr-branch-label">则</span>' + esc(b.decision) +
            (b.action ? actionLink(b.action) : '') +
          '</div>' +
          (b.why ? '<div class="cr-branch-why">' + esc(b.why) + '</div>' : '') +
          (b.source ? '<div class="cr-branch-src">来源：' + esc(b.source) + '</div>' : '') +
        '</div>';
      }).join('');
      return '<div class="cr-card">' +
        '<div class="cr-card-head" onclick="crToggle(\'' + escA(t.id) + '\')">' +
          '<span class="cr-num">' + (i + 1) + '</span>' +
          '<span class="cr-title">' + esc(t.title) + '</span>' +
          '<span class="cr-toggle" data-t="' + escA(t.id) + '">▸</span>' +
        '</div>' +
        '<div class="cr-card-body" id="cr-body-' + escA(t.id) + '">' +
          '<div class="cr-root"><span class="cr-branch-label">入口</span>' + esc(t.root) + '</div>' +
          '<div class="cr-branches">' + branches + '</div>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  // ─────────── 3. 案例库 ───────────
  function renderCases() {
    var box = document.getElementById('crCaseList');
    if (!box) return;
    var data = (global.clinicalReasoning || {}).cases || [];
    box.innerHTML = data.map(function (c, i) {
      var examRows = c.examFindings.map(function (e) {
        return '<tr>' +
          '<td class="cr-test">' + esc(e.test) + '</td>' +
          '<td>' + esc(e.result) + '</td>' +
          '<td class="cr-tag">' + esc(e.tag || '') + '</td>' +
        '</tr>';
      }).join('');
      var scales = (c.scaleSummary || []).map(function (s) {
        var id = (s.id || '').slice(6);
        return '<span class="cr-scale-chip" onclick="crGoScale(\'' + escA(id) + '\')">' + esc(s.note) + '</span>';
      }).join('');
      var plan = (c.plan || []).map(function (p, pi) {
        return '<li><b>' + esc(p.step) + '</b>：' + esc(p.detail) + '</li>';
      }).join('');
      var srcs = (c.sources || []).map(function (s) { return esc(s); }).join('；');
      return '<div class="cr-card">' +
        '<div class="cr-card-head" onclick="crToggle(\'' + escA(c.id) + '\')">' +
          '<span class="cr-num">' + (i + 1) + '</span>' +
          '<span class="cr-title">' + esc(c.title) + '</span>' +
          '<span class="cr-toggle" data-t="' + escA(c.id) + '">▸</span>' +
        '</div>' +
        '<div class="cr-card-body" id="cr-body-' + escA(c.id) + '">' +
          '<div class="cr-c-label">主诉</div><p class="cr-c-text">' + esc(c.presentation) + '</p>' +
          '<div class="cr-c-label">查体发现</div>' +
          '<div class="cr-table-wrap"><table class="cr-table"><thead><tr>' +
            '<th>检查</th><th>发现</th><th>提示</th>' +
          '</tr></thead><tbody>' + examRows + '</tbody></table></div>' +
          '<div class="cr-c-label">量表评估</div><div class="cr-scale-row">' + scales + '</div>' +
          '<div class="cr-c-label">诊断</div><p class="cr-c-text">' + esc(c.diagnosis) + '</p>' +
          '<div class="cr-c-label">方案</div><ul class="cr-plan">' + plan + '</ul>' +
          '<div class="cr-c-label">随访</div><p class="cr-c-text">' + esc(c.followUp) + '</p>' +
          '<div class="cr-evidence">来源：' + srcs + '</div>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  // ─────────── Tab 切换 / 展开折叠 ───────────
  function crSelectTab(tab) {
    ACTIVE_TAB = tab;
    ['diff', 'tree', 'case'].forEach(function (t) {
      var btn = document.getElementById('crTab' + (t === 'diff' ? 'Diff' : t === 'tree' ? 'Tree' : 'Case'));
      if (btn) btn.classList.toggle('active', t === tab);
      var list = document.getElementById('cr' + (t === 'diff' ? 'Diff' : t === 'tree' ? 'Tree' : 'Case') + 'List');
      if (list) list.style.display = (t === tab) ? 'block' : 'none';
    });
  }

  function crToggle(id) {
    var body = document.getElementById('cr-body-' + id);
    var tgl = document.querySelector('.cr-toggle[data-t="' + id + '"]');
    if (!body) return;
    body.classList.toggle('open');
    if (tgl) tgl.classList.toggle('open');
  }

  // ─────────── 主入口 ───────────
  function renderClinicalReasoning() {
    renderDifferentials();
    renderDecisionTrees();
    renderCases();
    // 默认展开第一张卡
    ['diff', 'tree', 'case'].forEach(function (t) {
      var list = document.getElementById('cr' + (t === 'diff' ? 'Diff' : t === 'tree' ? 'Tree' : 'Case') + 'List');
      if (list) {
        var firstCard = list.querySelector('.cr-card');
        if (firstCard) {
          var id = (firstCard.querySelector('.cr-toggle') || {}).getAttribute ? firstCard.querySelector('.cr-toggle').getAttribute('data-t') : null;
          if (id) crToggle(id);
        }
      }
    });
    crSelectTab('diff');
  }

  global.renderClinicalReasoning = renderClinicalReasoning;
  global.crSelectTab = crSelectTab;
  global.crToggle = crToggle;
  global.crGoScale = crGoScale;
})(window);