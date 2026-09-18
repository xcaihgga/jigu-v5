/**
 * ═══════════════════════════════════════════════════════════════
 *  数据看板模块
 *  包含：统计卡片、近6月趋势柱状图、评定分类分布、最常用量表 Top10、常用量表平均分
 * ═══════════════════════════════════════════════════════════════
 *
 *  使用方式：
 *    <script src="src/dashboard.js"></script>
 *    在切换到看板 Tab 或数据更新时调用 renderDashboard()
 *
 *  依赖（全局）：
 *    - utils.js: safeGetJSON
 *    - data.js:  量表分类信息（通过 record.category 间接依赖）
 */

(function (global) {
  'use strict';

  // ═══════════════════════════════════════════════════
  //  1. 分类映射与配色
  // ═══════════════════════════════════════════════════

  var dashboardCategoryMap = {
    'function': { name: '运动功能', color: 'var(--accent-blue)' },
    'muscle':   { name: '肌力与痉挛', color: 'var(--accent-teal)' },
    'pain':     { name: '疼痛', color: 'var(--accent-amber)' },
    'mental':   { name: '认知与心理', color: 'var(--accent-violet)' },
    'quality':  { name: '吞咽与言语', color: 'var(--accent-magenta)' }
  };

  var dashboardCategoryColors = [
    'var(--accent-blue)', 'var(--accent-teal)', 'var(--accent-amber)',
    'var(--accent-violet)', 'var(--accent-magenta)', 'var(--bg-brand)',
    'var(--accent-teal)', 'var(--status-error-default)'
  ];

  // ═══════════════════════════════════════════════════
  //  2. 主渲染入口
  // ═══════════════════════════════════════════════════

  function renderDashboard() {
    var records = safeGetJSON('assessmentHistory');
    var patients = safeGetJSON('patients');

    var totalAssessments = records.length;
    var totalPatients = patients.length;

    // 副标题统计
    var subtitle = document.getElementById('dashboardSubtitle');
    if (subtitle) {
      subtitle.textContent = totalAssessments + ' 条评定 · ' + totalPatients + ' 位患者';
    }

    // 统计卡片（顺序：总评定数 → 本周评定 → 患者总数 → 量表种类）
    var statsContainer = document.getElementById('dashboardStats');
    if (statsContainer) {
      var weekAgo = Date.now() - 7 * 24 * 3600 * 1000;
      var weekAssessments = records.filter(function (r) {
        return r.date && new Date(r.date).getTime() > weekAgo;
      }).length;
      var scaleTypes = {};
      records.forEach(function (r) {
        if (r.scaleName) scaleTypes[r.scaleName] = true;
      });
      var scaleCount = Object.keys(scaleTypes).length;

      statsContainer.innerHTML =
        '<div class="stat-card"><div class="stat-card-emoji">📋</div><div class="stat-card-value">' + totalAssessments + '</div><div class="stat-card-label">总评定数</div></div>' +
        '<div class="stat-card"><div class="stat-card-emoji">📅</div><div class="stat-card-value">' + weekAssessments + '</div><div class="stat-card-label">本周评定</div></div>' +
        '<div class="stat-card"><div class="stat-card-emoji">👤</div><div class="stat-card-value">' + totalPatients + '</div><div class="stat-card-label">患者总数</div></div>' +
        '<div class="stat-card"><div class="stat-card-emoji">📐</div><div class="stat-card-value">' + scaleCount + '</div><div class="stat-card-label">量表种类</div></div>';
    }

    // 趋势图
    drawDashboardChart(records);

    // 评定分类分布
    renderDashboardDist(records);

    // 最常用量表 Top 10
    renderDashboardRank(records);

    // 常用量表平均分
    renderDashboardAvg(records);
  }

  // ═══════════════════════════════════════════════════
  //  3. 评定分类分布（水平条形图）
  // ═══════════════════════════════════════════════════

  function renderDashboardDist(records) {
    var container = document.getElementById('dashboardDistChart');
    if (!container) return;

    var counts = {};
    records.forEach(function (r) {
      var cat = r.category || 'other';
      counts[cat] = (counts[cat] || 0) + 1;
    });

    var keys = Object.keys(counts);
    if (keys.length === 0) {
      container.innerHTML = '<div class="dist-empty">暂无评估数据</div>';
      return;
    }

    var total = records.length;
    var sorted = keys.map(function (k) {
      var info = dashboardCategoryMap[k] || { name: '其他' };
      return { key: k, name: info.name, count: counts[k], color: info.color };
    }).sort(function (a, b) { return b.count - a.count; });

    sorted.forEach(function (item, i) {
      if (!item.color) item.color = dashboardCategoryColors[i % dashboardCategoryColors.length];
    });

    var maxVal = sorted[0].count;
    container.innerHTML = sorted.map(function (item) {
      var pct = Math.round(item.count / total * 100);
      var widthPct = Math.round(item.count / maxVal * 100);
      return '<div class="dist-item">' +
        '<div class="dist-label">' + item.name + '</div>' +
        '<div class="dist-bar-wrap"><div class="dist-bar-fill" style="width:' + widthPct + '%;background:' + item.color + ';"></div></div>' +
        '<div class="dist-count">' + item.count + ' · ' + pct + '%</div>' +
      '</div>';
    }).join('');
  }

  // ═══════════════════════════════════════════════════
  //  4. 常用量表平均分（同一量表 ≥ 2 次评定）
  // ═══════════════════════════════════════════════════

  function renderDashboardAvg(records) {
    var list = document.getElementById('dashboardAvgList');
    if (!list) return;

    var groups = {};
    records.forEach(function (r) {
      if (!r.scaleName || typeof r.score !== 'number') return;
      if (!groups[r.scaleName]) groups[r.scaleName] = { name: r.scaleName, scores: [], maxScore: 0 };
      groups[r.scaleName].scores.push(r.score);
      if (r.maxScore && !groups[r.scaleName].maxScore) groups[r.scaleName].maxScore = r.maxScore;
    });

    var items = Object.keys(groups).map(function (k) {
      var g = groups[k];
      var sum = g.scores.reduce(function (a, b) { return a + b; }, 0);
      return { name: g.name, avg: (sum / g.scores.length).toFixed(1), count: g.scores.length, maxScore: g.maxScore };
    }).filter(function (it) { return it.count >= 2; }).sort(function (a, b) { return b.count - a.count; });

    if (items.length === 0) {
      list.innerHTML = '<div class="dashboard-empty">暂无足够数据<br>同一量表完成 2 次及以上评定后将显示平均分</div>';
      return;
    }

    list.innerHTML = items.map(function (item) {
      return '<li class="avg-score-item">' +
        '<div class="avg-score-name">' + item.name + '</div>' +
        '<div class="avg-score-value">' + item.avg + (item.maxScore ? ' / ' + item.maxScore : '') + '</div>' +
        '<div class="avg-score-count">' + item.count + '次</div>' +
      '</li>';
    }).join('');
  }

  // ═══════════════════════════════════════════════════
  //  5. 近6月趋势柱状图（Canvas 绘制）
  // ═══════════════════════════════════════════════════

  function drawDashboardChart(records) {
    var canvas = document.getElementById('dashboardChart');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var dpr = window.devicePixelRatio || 1;
    var rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    var w = rect.width, h = rect.height;
    ctx.clearRect(0, 0, w, h);

    // 按月统计近6月
    var months = [];
    var now = new Date();
    for (var i = 5; i >= 0; i--) {
      var d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({ year: d.getFullYear(), month: d.getMonth(), count: 0 });
    }

    records.forEach(function (r) {
      if (!r.date) return;
      var rd = new Date(r.date);
      months.forEach(function (m) {
        if (m.year === rd.getFullYear() && m.month === rd.getMonth()) m.count++;
      });
    });

    var maxVal = Math.max.apply(null, months.map(function (m) { return m.count; }));
    if (maxVal === 0) maxVal = 1;

    var padding = { top: 20, right: 20, bottom: 30, left: 35 };
    var chartW = w - padding.left - padding.right;
    var chartH = h - padding.top - padding.bottom;

    // 网格线
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 0.5;
    for (var gi = 0; gi <= 4; gi++) {
      var y = padding.top + chartH * gi / 4;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(padding.left + chartW, y);
      ctx.stroke();
      ctx.fillStyle = '#9ca3af';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(Math.round(maxVal * (4 - gi) / 4), padding.left - 5, y + 3);
    }

    // 柱状图
    var barW = chartW / months.length * 0.5;
    months.forEach(function (m, i) {
      var x = padding.left + (chartW / months.length) * (i + 0.5) - barW / 2;
      var barH = (m.count / maxVal) * chartH;
      var by = padding.top + chartH - barH;

      var gradient = ctx.createLinearGradient(0, by, 0, padding.top + chartH);
      gradient.addColorStop(0, '#3F85FF');
      gradient.addColorStop(1, '#2563eb');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(x, by, barW, barH, 4);
      } else {
        ctx.rect(x, by, barW, barH);
      }
      ctx.fill();

      // 数值
      if (m.count > 0) {
        ctx.fillStyle = '#1d4ed8';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(m.count, x + barW / 2, by - 5);
      }

      // 月份标签
      ctx.fillStyle = '#6b7280';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText((m.month + 1) + '月', x + barW / 2, padding.top + chartH + 18);
    });
  }

  // ═══════════════════════════════════════════════════
  //  6. 最常用量表 Top 10
  // ═══════════════════════════════════════════════════

  function renderDashboardRank(records) {
    var list = document.getElementById('dashboardRankList');
    if (!list) return;

    var counts = {};
    records.forEach(function (r) {
      if (r.scaleName) counts[r.scaleName] = (counts[r.scaleName] || 0) + 1;
    });

    var sorted = Object.keys(counts).map(function (name) {
      return { name: name, count: counts[name] };
    }).sort(function (a, b) { return b.count - a.count; }).slice(0, 10);

    if (sorted.length === 0) {
      list.innerHTML = '<div class="dashboard-empty">暂无评估数据<br>开始使用评估量表后将自动统计</div>';
      return;
    }

    list.innerHTML = sorted.map(function (item, i) {
      var numClass = i === 0 ? 'top1' : i === 1 ? 'top2' : i === 2 ? 'top3' : 'other';
      return '<li class="rank-item">' +
        '<div class="rank-num ' + numClass + '">' + (i + 1) + '</div>' +
        '<div class="rank-name">' + item.name + '</div>' +
        '<div class="rank-count">' + item.count + '次</div>' +
      '</li>';
    }).join('');
  }

  // ═══════════════════════════════════════════════════
  //  7. 挂载到 window（init / Tab 切换 / 数据更新调用）
  // ═══════════════════════════════════════════════════

  global.renderDashboard = renderDashboard;
  global.renderDashboardDist = renderDashboardDist;
  global.renderDashboardAvg = renderDashboardAvg;
  global.drawDashboardChart = drawDashboardChart;
  global.renderDashboardRank = renderDashboardRank;
})(typeof window !== 'undefined' ? window : this);
