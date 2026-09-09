/**
 * ═══════════════════════════════════════════════════════════════
 *  交互日志器（埋点）interactionLog
 *  - 级别：debug / info / warn / error
 *  - 默认 debug；通过 localStorage.interactionLogLevel='warn' 切生产模式
 *    或 URL 参数 ?log=warn 临时切换
 *  - 输出格式：[Interaction][LEVEL] event payload
 *  - 生产环境（非 localhost）自动降为 warn
 * ═══════════════════════════════════════════════════════════════
 *
 *  从 index.html 内联脚本拆分而来，无外部依赖。
 *  必须在所有使用 window.interactionLog 的脚本之前加载。
 */
(function () {
  var LEVELS = { debug: 0, info: 1, warn: 2, error: 3 };
  function detectLevel() {
    try {
      var urlMatch = (location.search || '').match(/[?&]log=([a-z]+)/);
      if (urlMatch && LEVELS[urlMatch[1]] !== undefined) return urlMatch[1];
      var stored = localStorage.getItem('interactionLogLevel');
      if (stored && LEVELS[stored] !== undefined) return stored;
      var host = location.hostname || '';
      if (host && host !== 'localhost' && host !== '127.0.0.1' && host.indexOf('192.168.') !== 0) {
        return 'warn';
      }
    } catch (e) {}
    return 'debug';
  }
  var currentLevel = detectLevel();
  function emit(level, event, payload) {
    if (LEVELS[level] < LEVELS[currentLevel]) return;
    var fn = level === 'error' ? console.error :
             level === 'warn'  ? console.warn  :
             level === 'info'  ? console.log   : console.debug;
    fn('[Interaction][' + level.toUpperCase() + ']', event, payload || '');
  }
  window.interactionLog = {
    level: currentLevel,
    setLevel: function(l) {
      if (LEVELS[l] !== undefined) { currentLevel = l; this.level = l; try { localStorage.setItem('interactionLogLevel', l); } catch(e){} }
    },
    debug: function(e, p) { emit('debug', e, p); },
    info:  function(e, p) { emit('info',  e, p); },
    warn:  function(e, p) { emit('warn',  e, p); },
    error: function(e, p) { emit('error', e, p); }
  };
  window.interactionLog.info('logger.init', { level: currentLevel, ua: navigator.userAgent });
})();
