/**
 * ═══════════════════════════════════════════════════════════════
 *  路由模块（Tab 切换、二级页面跳转、回退历史）
 *  依赖：realtime-bar.js（rtSession / rtSetModule / rtSetAction / updateSessionStats）
 *        dashboard（renderDashboard / renderDashboardSources，延迟调用）
 * ═══════════════════════════════════════════════════════════════
 *
 *  使用方式：
 *    <script src="src/router.js"></script>
 *    在 DOM 加载完成后会自动绑定事件（需保证 DOM 元素已存在）
 */

(function (global) {
  'use strict';

  // ═══════════════════════════════════════════════════
  //  1. 路由状态（模块内私有，外部通过函数访问）
  // ═══════════════════════════════════════════════════

  var pages = ['muscle', 'diagnosis', 'assessment', 'tools', 'guidelines', 'patient'];
  var currentTab = 'muscle';
  var pageHistory = [];
  var currentPage = null;

  // 看板渲染防重入/过期 token：用户快速切 tab 时，旧渲染请求会被作废
  var __dashboardRenderToken = 0;

  // ═══════════════════════════════════════════════════
  //  2. Tab 切换
  // ═══════════════════════════════════════════════════

  /**
   * 切换主 Tab
   * @param {string} tab - 目标 tab 名
   */
  function switchTab(tab) {
    // 迁移报告页面需要管理员权限，由 AppConfig 统一校验
    if (tab === 'migration') {
      var pageEl = document.getElementById('page-migration');
      if (pageEl) {
        document.querySelectorAll('.page').forEach(function (el) { el.classList.remove('active'); });
        pageEl.classList.add('active');
        document.querySelectorAll('.desktop-nav-item').forEach(function (el) {
          el.classList.toggle('active', el.dataset.tab === tab);
        });
        updateNavTitle(tab);
        document.getElementById('navBack').style.display = 'none';
        // 调用 AppConfig 的权限校验
        if (global.AppConfig) {
          AppConfig.checkMigrationPermission();
        }
      }
      return;
    }

    var prevTab = currentTab; // 先保存旧 tab
    currentTab = tab;
    pageHistory = [];
    currentPage = null;
    document.querySelectorAll('.tab-item').forEach(function (el) {
      el.classList.toggle('active', el.dataset.tab === tab);
    });
    document.querySelectorAll('.desktop-nav-item').forEach(function (el) {
      el.classList.toggle('active', el.dataset.tab === tab);
    });
    document.querySelectorAll('.page').forEach(function (el) {
      el.classList.remove('active');
    });
    var targetEl = document.getElementById('page-' + tab);
    if (targetEl) targetEl.classList.add('active');
    document.getElementById('content').scrollTop = 0;
    updateNavTitle(tab);
    document.getElementById('navBack').style.display = 'none';

    // 更新实时操作栏
    if (prevTab !== tab && global.rtSession) {
      global.rtSession.tabSwitches++; // 点同一个 tab 不计数
    }
    if (global.__rtViewedTabs) global.__rtViewedTabs.add(tab);
    var tabNames = (global.AppConfig && AppConfig.NAV_TITLES) || {
      muscle: '肌肉查询', diagnosis: '临床诊断', assessment: '评估量表',
      tools: '临床工具', guidelines: '临床指南', protocol: '循证方案',
      dashboard: '数据看板', patient: '病例管理', migration: '数据迁移',
    };
    if (global.rtSetModule) global.rtSetModule(tabNames[tab] || tab);
    if (global.rtSetAction) global.rtSetAction('切换到' + (tabNames[tab] || tab));

    if (tab === 'dashboard') {
      // 用 token 防止用户快速切 tab 导致重复/过期渲染
      var __dashToken = ++__dashboardRenderToken;
      function _doRenderDash() {
        if (__dashToken !== __dashboardRenderToken) return; // 用户已切走，作废
        try { if (global.renderDashboard) renderDashboard(); } catch (e) { console.warn('[Dashboard] renderDashboard 失败:', e && e.message ? e.message : e); }
        try { if (global.renderDashboardSources) renderDashboardSources(); } catch (e) { console.warn('[Dashboard] renderDashboardSources 失败:', e && e.message ? e.message : e); }
      }
      // 数据已就绪直接渲染（绝大多数情况）；否则等 data-loader-complete
      if (typeof global.assessmentScales !== 'undefined' && Array.isArray(global.assessmentScales)) {
        _doRenderDash();
      } else {
        global.addEventListener('data-loader-complete', function onDashData() {
          global.removeEventListener('data-loader-complete', onDashData);
          _doRenderDash();
        });
      }
    }
    if (global.updateSessionStats) updateSessionStats();
  }

  /**
   * 更新顶部导航标题
   * @param {string} tab
   */
  function updateNavTitle(tab) {
    var titles = (global.AppConfig && AppConfig.NAV_TITLES) || {
      muscle: '肌肉查询',
      diagnosis: '临床诊断',
      assessment: '评估量表',
      tools: '临床工具',
      guidelines: '临床指南',
      protocol: '循证方案',
      dashboard: '数据看板',
      patient: '病例管理',
      migration: '数据迁移报告',
    };
    var titleEl = document.getElementById('navTitle');
    if (titleEl) titleEl.textContent = titles[tab] || '肌骨速查';
  }

  /**
   * 回退到上一页
   */
  function goBack() {
    if (pageHistory.length > 0) {
      var prev = pageHistory.pop();
      if (prev.pageName === null) {
        document.getElementById('navBack').style.display = 'none';
        currentPage = null;
        switchTab(currentTab);
      } else {
        showPage(prev.pageName, false);
        if (prev.title) {
          var titleEl = document.getElementById('navTitle');
          if (titleEl) titleEl.textContent = prev.title;
        }
        if (prev.scrollTop !== undefined) {
          setTimeout(function () {
            var contentEl = document.getElementById('content');
            if (contentEl) contentEl.scrollTop = prev.scrollTop;
          }, 50);
        }
      }
    } else {
      document.getElementById('navBack').style.display = 'none';
      currentPage = null;
      switchTab(currentTab);
    }
  }

  /**
   * 进入二级详情页
   * @param {string} pageName - 目标页名称
   * @param {boolean} [pushHistory=true] - 是否记录历史
   */
  function showPage(pageName, pushHistory) {
    if (pushHistory !== false) {
      var titleEl = document.getElementById('navTitle');
      var contentEl = document.getElementById('content');
      pageHistory.push({
        pageName: currentPage,
        scrollTop: contentEl ? contentEl.scrollTop : 0,
        title: titleEl ? titleEl.textContent : ''
      });
    }
    currentPage = pageName;
    document.querySelectorAll('.page').forEach(function (el) { el.classList.remove('active'); });
    var pageEl = document.getElementById('page-' + pageName);
    if (pageEl) {
      pageEl.classList.add('active');
      pageEl.classList.add('fade-in');
      setTimeout(function () { pageEl.classList.remove('fade-in'); }, 200);
    }
    var contentEl2 = document.getElementById('content');
    if (contentEl2) contentEl2.scrollTop = 0;
    var navBackEl = document.getElementById('navBack');
    if (navBackEl) navBackEl.style.display = 'flex';
    if (global.rtSession) global.rtSession.pageViews++;
    if (global.updateSessionStats) updateSessionStats();
  }

  // ═══════════════════════════════════════════════════
  //  3. 事件绑定（DOM 已就绪后立即执行）
  // ═══════════════════════════════════════════════════

  function bindRouterEvents() {
    document.querySelectorAll('.tab-item').forEach(function (el) {
      el.addEventListener('click', function () { switchTab(el.dataset.tab); });
    });

    document.querySelectorAll('.desktop-nav-item').forEach(function (el) {
      el.addEventListener('click', function () {
        document.querySelectorAll('.desktop-nav-item').forEach(function (i) { i.classList.remove('active'); });
        el.classList.add('active');
        switchTab(el.dataset.tab);
      });
    });

    var navBackEl = document.getElementById('navBack');
    if (navBackEl) navBackEl.addEventListener('click', goBack);
  }

  // 立即绑定（脚本在 body 末尾引入，DOM 已就绪）
  bindRouterEvents();

  // ═══════════════════════════════════════════════════
  //  4. 导出（保持全局兼容）
  // ═══════════════════════════════════════════════════

  global.switchTab = switchTab;
  global.updateNavTitle = updateNavTitle;
  global.goBack = goBack;
  global.showPage = showPage;
  global.bindRouterEvents = bindRouterEvents;

})(typeof window !== 'undefined' ? window : this);
