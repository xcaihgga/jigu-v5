/**
 * 肌骨康复速查 V5.0 — Service Worker
 *
 * 离线策略：
 * - 导航请求（index.html）：网络优先，失败回退缓存（保证内容可更新）
 * - 静态资源（js / 图片 / manifest / 图标 / data.js）：缓存优先 + 后台静默更新（stale-while-revalidate）
 * - 数据文件通过 data-loader 以 `?v=时间戳` 加载，故缓存键忽略查询参数
 */
const CACHE_NAME = 'jigu-v5-v1';

// 首次安装即预缓存的轻量外壳（不含 7.2MB 的 data.js，它走运行时缓存）
const PRECACHE = [
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-512-maskable.png',
  './icons/apple-touch-icon.png',
  './src/app-config.js',
  './src/logger.js',
  './src/utils.js',
  './src/data-loader.js',
  './src/realtime-bar.js',
  './src/router.js',
  './src/muscle-disease.js',
  './src/scale-teaching.js',
  './src/scales-ui.js',
  './src/protocols-tools-guidelines.js',
  './src/dashboard.js',
  './src/migration-report.js'
];

// 忽略查询参数，统一用 origin + pathname 作为缓存键
function cacheKey(url) {
  return url.origin + url.pathname;
}

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function (cache) { return cache.addAll(PRECACHE); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys()
      .then(function (keys) {
        return Promise.all(
          keys.filter(function (k) { return k !== CACHE_NAME; })
            .map(function (k) { return caches.delete(k); })
        );
      })
      .then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (event) {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // 不处理跨域资源

  // 导航请求：网络优先，失败回退缓存
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then(function (res) {
          const copy = res.clone();
          caches.open(CACHE_NAME).then(function (c) { c.put('./index.html', copy); });
          return res;
        })
        .catch(function () {
          return caches.match('./index.html');
        })
    );
    return;
  }

  // 其他资源：缓存优先，命中立即返回并后台更新
  event.respondWith(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.match(cacheKey(url)).then(function (cached) {
        const network = fetch(req)
          .then(function (res) {
            if (res && res.status === 200) cache.put(cacheKey(url), res.clone());
            return res;
          })
          .catch(function () { return null; });
        return cached || network;
      });
    })
  );
});