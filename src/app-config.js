/**
 * ═══════════════════════════════════════════════════════════════
 *  肌骨康复速查 V5.0 — 主应用配置文件
 *  统一管理环境检测、用户角色、权限校验、路由集成
 * ═══════════════════════════════════════════════════════════════
 *
 *  使用方式：
 *    在 index.html 中通过 <script src="src/app-config.js"></script> 引入
 *    该文件需在其他业务脚本之前加载
 *
 *  依赖：无（纯原生 JS，兼容所有浏览器）
 */

(function (global) {
  'use strict';

  // ═══════════════════════════════════════════════════
  //  1. 环境检测
  // ═══════════════════════════════════════════════════

  /**
   * 检测当前运行环境
   * 通过 hostname 判断：localhost / 127.0.0.1 / 内网 IP 为开发环境
   * @returns {'development'|'production'}
   */
  function detectEnvironment() {
    var hostname = global.location && global.location.hostname;
    if (!hostname) return 'production'; // 无 location 上下文时安全降级
    // 开发环境：localhost、127.0.0.1、内网 IP（192.168.* / 10.* / 172.16-31.*）
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '0.0.0.0') {
      return 'development';
    }
    if (/^(192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[0-1])\.)/.test(hostname)) {
      return 'development';
    }
    return 'production';
  }

  var ENV = detectEnvironment();

  // ═══════════════════════════════════════════════════
  //  2. 用户角色定义
  // ═══════════════════════════════════════════════════

  var USER_ROLES = {
    GUEST: 'guest',         // 未登录访客
    CLINICIAN: 'clinician', // 临床医生（可查看评估、病例，不可查看迁移报告）
    ADMIN: 'admin'          // 管理员（全部权限）
  };

  /**
   * 各页面的最低角色要求
   * 角色等级：GUEST < CLINICIAN < ADMIN
   */
  var PAGE_PERMISSIONS = {
    muscle: USER_ROLES.GUEST,
    diagnosis: USER_ROLES.GUEST,
    assessment: USER_ROLES.GUEST,
    tools: USER_ROLES.GUEST,
    guidelines: USER_ROLES.GUEST,
    protocol: USER_ROLES.GUEST,
    patient: USER_ROLES.CLINICIAN,
    dashboard: USER_ROLES.CLINICIAN,
    migration: USER_ROLES.ADMIN   // 迁移报告仅管理员可访问
  };

  var ROLE_LEVELS = {};
  ROLE_LEVELS[USER_ROLES.GUEST] = 0;
  ROLE_LEVELS[USER_ROLES.CLINICIAN] = 1;
  ROLE_LEVELS[USER_ROLES.ADMIN] = 2;

  // ═══════════════════════════════════════════════════
  //  3. 角色管理
  // ═══════════════════════════════════════════════════

  /**
   * 获取当前用户角色
   * 优先从 localStorage 读取登录态；
   * 无存储或未设置时，开发环境默认 ADMIN，生产环境默认 GUEST
   * @returns {string} 用户角色
   */
  function getCurrentUserRole() {
    try {
      var stored = global.localStorage && global.localStorage.getItem('userRole');
      if (stored && ROLE_LEVELS.hasOwnProperty(stored)) {
        return stored;
      }
    } catch (e) {
      // localStorage 不可用时降级到环境默认值
    }
    // 开发环境默认 admin（方便调试），生产环境默认 guest（安全）
    return ENV === 'development' ? USER_ROLES.ADMIN : USER_ROLES.GUEST;
  }

  /**
   * 设置用户角色（登录/登出时调用）
   * @param {string} role - USER_ROLES 中的值
   */
  function setUserRole(role) {
    try {
      global.localStorage.setItem('userRole', role);
    } catch (e) {
      // localStorage 不可用时忽略
    }
  }

  /**
   * 清除用户角色（登出时调用）
   */
  function clearUserRole() {
    try {
      global.localStorage.removeItem('userRole');
    } catch (e) {
      // 忽略
    }
  }

  /**
   * 检查用户是否有权限访问指定页面
   * @param {string} pageName - 页面名称（如 'migration'）
   * @param {string} [role] - 指定角色，不传则使用当前角色
   * @returns {boolean}
   */
  function hasPermission(pageName, role) {
    var userRole = role || getCurrentUserRole();
    var requiredRole = PAGE_PERMISSIONS[pageName] || USER_ROLES.GUEST;
    return (ROLE_LEVELS[userRole] || 0) >= (ROLE_LEVELS[requiredRole] || 0);
  }

  // ═══════════════════════════════════════════════════
  //  4. 权限校验
  // ═══════════════════════════════════════════════════

  /**
   * 校验迁移报告页面访问权限
   * 仅 ADMIN 角色可访问；其他角色显示拒绝页面
   * @returns {boolean} 是否通过校验
   */
  function checkMigrationPermission() {
    var role = getCurrentUserRole();
    var deniedEl = document.getElementById('migrationAccessDenied');
    var containerEl = document.getElementById('migrationReportContainer');

    if (!deniedEl || !containerEl) {
      console.warn('[AppConfig] 迁移报告页面 DOM 元素未找到');
      return false;
    }

    if (hasPermission('migration', role)) {
      deniedEl.style.display = 'none';
      containerEl.style.display = 'block';
      // 延迟调用渲染函数（避免在 DOM 完全就绪前执行）
      if (typeof global.renderMigrationReport === 'function') {
        global.renderMigrationReport();
      }
      console.log('[AppConfig] 迁移报告权限校验通过，角色:', role);
      return true;
    } else {
      deniedEl.style.display = 'block';
      containerEl.style.display = 'none';
      console.log('[AppConfig] 迁移报告权限校验拒绝，角色:', role);
      return false;
    }
  }

  /**
   * 通用页面权限守卫
   * 在 switchTab 中调用，拦截无权限的页面跳转
   * @param {string} tab - 目标页面
   * @returns {boolean} 是否允许跳转
   */
  function guardRoute(tab) {
    if (!hasPermission(tab)) {
      var role = getCurrentUserRole();
      console.warn('[AppConfig] 路由访问被拒:', tab, '当前角色:', role);

      // 对于迁移报告，显示专用拒绝页面
      if (tab === 'migration') {
        return false; // 允许切换到该页面但显示拒绝内容
      }

      // 对于其他受保护页面，弹出提示
      if (typeof global.alert === 'function') {
        global.alert('权限不足：当前角色（' + role + '）无法访问此页面，请联系管理员。');
      }
      return false;
    }
    return true;
  }

  // ═══════════════════════════════════════════════════
  //  5. 导航标题映射
  // ═══════════════════════════════════════════════════

  var NAV_TITLES = {
    muscle: '肌肉查询',
    diagnosis: '临床诊断',
    assessment: '评估量表',
    tools: '临床工具',
    guidelines: '临床指南',
    protocol: '循证方案',
    dashboard: '数据看板',
    patient: '病例管理',
    migration: '数据迁移报告'
  };

  // ═══════════════════════════════════════════════════
  //  6. 导出到全局
  // ═══════════════════════════════════════════════════

  global.AppConfig = {
    ENV: ENV,
    USER_ROLES: USER_ROLES,
    PAGE_PERMISSIONS: PAGE_PERMISSIONS,
    ROLE_LEVELS: ROLE_LEVELS,
    NAV_TITLES: NAV_TITLES,

    detectEnvironment: detectEnvironment,
    getCurrentUserRole: getCurrentUserRole,
    setUserRole: setUserRole,
    clearUserRole: clearUserRole,
    hasPermission: hasPermission,
    checkMigrationPermission: checkMigrationPermission,
    guardRoute: guardRoute
  };

  // ═══════════════════════════════════════════════════
  //  7. 初始化日志
  // ═══════════════════════════════════════════════════

  console.log('[AppConfig] 环境检测:', ENV, '| 主机:', global.location ? global.location.hostname : 'unknown');
  console.log('[AppConfig] 当前角色:', getCurrentUserRole());

})(typeof window !== 'undefined' ? window : this);
