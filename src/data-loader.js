/**
 * 数据懒加载器
 * 负责异步加载所有数据文件，支持进度显示和错误处理
 */
(function() {
  'use strict';

  // 配置：需要加载的数据文件列表
  const DATA_FILES = [
    'data.js',
    'src/scales.js',
    'src/scales-extra.js',
    'src/scales-pro.js',
    'src/clinical-tools.js',
    'src/knowledge-base.js',
    'src/rehab-protocols.js',
    'src/protocols-pro.js',
    'src/pain-protocols.js'
  ];

  // 加载状态
  const state = {
    loaded: 0,
    total: DATA_FILES.length,
    errors: [],
    callbacks: []
  };

  /**
   * 动态加载单个脚本
   */
  function loadScript(src) {
    return new Promise(function(resolve, reject) {
      const script = document.createElement('script');
      script.src = src + '?v=' + Date.now(); // 添加时间戳避免缓存
      script.async = false; // 保持执行顺序
      
      script.onload = function() {
        resolve();
      };
      
      script.onerror = function(e) {
        reject(new Error('加载失败: ' + src));
      };
      
      document.head.appendChild(script);
    });
  }

  /**
   * 更新加载进度
   */
  function updateProgress(current, total, fileName) {
    // 触发进度事件
    window.dispatchEvent(new CustomEvent('data-loader-progress', {
      detail: {
        current: current,
        total: total,
        fileName: fileName,
        percent: Math.round((current / total) * 100)
      }
    }));
  }

  /**
   * 显示加载界面
   */
  function showLoadingUI() {
    // 创建加载界面
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'app-loading';
    loadingDiv.innerHTML = `
      <div style="
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        transition: opacity 0.3s ease;
      ">
        <div style="
          text-align: center;
          background: white;
          padding: 48px 64px;
          border-radius: 24px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.1);
        ">
          <div style="
            width: 64px;
            height: 64px;
            margin: 0 auto 24px;
            border: 4px solid #e0f2fe;
            border-top-color: #0d9488;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
          "></div>
          <h2 style="color: #1e293b; margin: 0 0 8px; font-size: 20px;">肌骨康复速查 V5.0</h2>
          <p style="color: #64748b; margin: 0 0 24px; font-size: 14px;">正在加载数据...</p>
          <div style="
            width: 200px;
            height: 6px;
            background: #e2e8f0;
            border-radius: 3px;
            overflow: hidden;
            margin: 0 auto;
          ">
            <div id="loading-bar" style="
              height: 100%;
              background: linear-gradient(90deg, #0d9488, #14b8a6);
              width: 0%;
              border-radius: 3px;
              transition: width 0.3s ease;
            "></div>
          </div>
          <p id="loading-text" style="color: #94a3b8; margin: 12px 0 0; font-size: 12px;">0%</p>
        </div>
      </div>
      <style>
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      </style>
    `;
    document.body.appendChild(loadingDiv);

    // 监听进度更新
    window.addEventListener('data-loader-progress', function(e) {
      const bar = document.getElementById('loading-bar');
      const text = document.getElementById('loading-text');
      if (bar) bar.style.width = e.detail.percent + '%';
      if (text) text.textContent = e.detail.percent + '%';
    });
  }

  /**
   * 隐藏加载界面
   */
  function hideLoadingUI() {
    const loadingDiv = document.getElementById('app-loading');
    if (loadingDiv) {
      loadingDiv.style.opacity = '0';
      setTimeout(function() {
        loadingDiv.remove();
      }, 300);
    }
  }

  /**
   * 加载所有数据文件
   */
  function loadAllData() {
    showLoadingUI();
    
    let chain = Promise.resolve();
    
    DATA_FILES.forEach(function(file) {
      chain = chain.then(function() {
        state.loaded++;
        updateProgress(state.loaded, state.total, file);
        return loadScript(file);
      }).catch(function(err) {
        state.errors.push(file);
        console.warn('[DataLoader] 加载失败:', file, err.message);
        // 继续加载下一个文件，不中断
      });
    });
    
    chain.then(function() {
      // 所有数据加载完成
      hideLoadingUI();
      
      if (state.errors.length > 0) {
        console.warn('[DataLoader] 以下文件加载失败:', state.errors);
        // 显示错误提示但继续初始化
        window.dispatchEvent(new CustomEvent('data-loader-error', {
          detail: { errors: state.errors }
        }));
      }
      
      // 触发数据加载完成事件
      window.dispatchEvent(new CustomEvent('data-loader-complete', {
        detail: { 
          success: state.errors.length === 0,
          failedFiles: state.errors 
        }
      }));
    });
    
    return chain;
  }

  // 暴露到全局
  window.DataLoader = {
    load: loadAllData,
    getProgress: function() {
      return {
        loaded: state.loaded,
        total: state.total,
        errors: state.errors.length
      };
    }
  };

  // 自动开始加载（如果在浏览器环境中）
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        loadAllData();
      });
    } else {
      loadAllData();
    }
  }
})();
