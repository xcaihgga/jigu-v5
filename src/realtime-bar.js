/**
 * ═══════════════════════════════════════════════════════════════
 *  实时操作信息栏（顶部数据版本栏）
 *  显示：当前模块名、实时时钟、最近操作、会话统计
 * ═══════════════════════════════════════════════════════════════
 *
 *  使用方式：
 *    <script src="src/realtime-bar.js"></script>
 *    在 DOMContentLoaded 后调用 initDataVersionBar()
 *
 *  依赖：无（纯原生 JS）
 *  被调用：router.js / scales-ui.js / protocols-tools-guidelines.js
 */

(function (global) {
  'use strict';

  // ═══════════════════════════════════════════════════
  //  1. 会话状态
  // ═══════════════════════════════════════════════════

  /**
   * 会话级操作统计
   * @type {Object}
   */
  var rtSession = {
    tabSwitches: 0,        // 实际切换 tab 次数（点同一个 tab 不算）
    assessments: 0,        // 提交评定总次数（包含重复量表）
    protocols: 0,          // 查看方案总次数（包含重复方案）
    pageViews: 0,          // 进入二级详情页总次数
    lastAction: '就绪'
  };

  // 去重集合（会话内不同 id 的数量，刷新后重置属正常行为）
  var __rtAssessedIds = global.__rtAssessedIds = new Set();    // 已评定过的不同量表 id
  var __rtViewedProtoIds = global.__rtViewedProtoIds = new Set(); // 已查看过的不同方案 id
  var __rtViewedTabs = global.__rtViewedTabs = new Set();      // 已访问过的不同 tab

  // 实时时钟 interval id，用于页面隐藏时暂停省电
  var __rtClockTimer = null;

  // ═══════════════════════════════════════════════════
  //  2. 初始化
  // ═══════════════════════════════════════════════════

  /**
   * 初始化实时操作信息栏
   * - 启动实时时钟（页面隐藏时自动暂停省电）
   * - 绑定统计面板展开/收起
   * - 渲染数据概况
   */
  function initDataVersionBar() {
    var bar = document.getElementById('dataVersionBar');
    if (!bar) return;

    var dot = document.getElementById('versionStatusDot');
    var toggle = document.getElementById('rtDetailToggle');
    var panel = document.getElementById('rtDetailPanel');

    // 状态点
    if (dot) {
      dot.className = 'version-dot';
      dot.title = '运行中';
    }

    // ─── 时钟 ───
    function updateClock() {
      var el = document.getElementById('rtTime');
      if (!el) return;
      var d = new Date();
      el.textContent = String(d.getHours()).padStart(2, '0') + ':' +
        String(d.getMinutes()).padStart(2, '0') + ':' +
        String(d.getSeconds()).padStart(2, '0');
    }
    updateClock();
    __rtClockTimer = setInterval(updateClock, 1000);

    // 页面隐藏时暂停时钟，页面切回时立即更新并重启（省电）
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        if (__rtClockTimer) { clearInterval(__rtClockTimer); __rtClockTimer = null; }
      } else {
        updateClock();
        if (!__rtClockTimer) { __rtClockTimer = setInterval(updateClock, 1000); }
      }
    });

    // ─── 数据概况（展开面板里） ───
    var scales = Array.isArray(global.assessmentScales) ? global.assessmentScales : [];
    var protocols = Array.isArray(global.rehabProtocols) ? global.rehabProtocols : [];
    var statsEl = document.getElementById('rtDataStats');
    if (statsEl) {
      statsEl.textContent = '量表 ' + scales.length + ' 个 · 协议 ' + protocols.length + ' 个';
    }

    // ─── 展开面板切换 ───
    if (toggle && panel) {
      toggle.addEventListener('click', function (e) {
        e.stopPropagation();
        bar.classList.toggle('expanded');
        panel.style.display = (panel.style.display === 'block') ? 'none' : 'block';
        updateSessionStats();
      });
    }

    document.addEventListener('click', function (e) {
      if (!bar.contains(e.target)) {
        bar.classList.remove('expanded');
        if (panel) panel.style.display = 'none';
      }
    });

    console.log('[RealtimeBar] 实时操作信息栏已启动');
  }

  // ═══════════════════════════════════════════════════
  //  3. 更新函数
  // ═══════════════════════════════════════════════════

  /**
   * 更新顶部栏的操作文本
   * @param {string} action - 操作描述
   */
  function rtSetAction(action) {
    rtSession.lastAction = action;
    var el = document.getElementById('rtAction');
    if (el) el.textContent = action;
  }

  /**
   * 更新顶部栏模块名
   * @param {string} name - 模块名称
   */
  function rtSetModule(name) {
    var el = document.getElementById('rtModule');
    if (el) el.textContent = name || '肌骨速查';
  }

  /**
   * 更新会话统计（语义一致：去重计数 + 总数，一目了然）
   */
  function updateSessionStats() {
    var el = document.getElementById('rtSessionStats');
    if (el) {
      var uniqScales = __rtAssessedIds.size;     // 不同量表数
      var uniqProtos = __rtViewedProtoIds.size;  // 不同方案数
      var uniqTabs = __rtViewedTabs.size;        // 覆盖 tab 数
      var parts = [];
      if (rtSession.assessments > 0) {
        parts.push('评定 ' + rtSession.assessments + ' 次' + (uniqScales > 0 && uniqScales !== rtSession.assessments ? '（' + uniqScales + ' 种）' : ''));
      }
      if (rtSession.protocols > 0) {
        parts.push('方案 ' + rtSession.protocols + ' 次' + (uniqProtos > 0 && uniqProtos !== rtSession.protocols ? '（' + uniqProtos + ' 种）' : ''));
      }
      parts.push('tab ' + rtSession.tabSwitches + ' 次（覆盖 ' + uniqTabs + '）');
      if (rtSession.pageViews > 0) {
        parts.push('详情 ' + rtSession.pageViews + ' 次');
      }
      el.textContent = parts.join(' · ');
    }
  }

  // ═══════════════════════════════════════════════════
  //  4. 导出（保持全局兼容，便于其他脚本调用）
  // ═══════════════════════════════════════════════════

  // 状态对象需要被其他模块读写，直接挂到 window
  global.rtSession = rtSession;

  global.initDataVersionBar = initDataVersionBar;
  global.rtSetAction = rtSetAction;
  global.rtSetModule = rtSetModule;
  global.updateSessionStats = updateSessionStats;

})(typeof window !== 'undefined' ? window : this);
