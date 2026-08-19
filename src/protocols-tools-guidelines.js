/**
 * ═══════════════════════════════════════════════════════════════
 *  临床工具 + 临床指南 + 康复方案模块
 *  包含：分类栏、列表、详情页、阶段概览表格（点击高亮 + 滚动联动）
 * ═══════════════════════════════════════════════════════════════
 *
 *  使用方式：
 *    <script src="src/protocols-tools-guidelines.js"></script>
 *    在 init() 中调用 renderToolsCategoryBar/renderToolsList/
 *              renderGuidelinesCategoryBar/renderGuidelinesList/
 *              renderProtocolCatBar/renderProtocolList
 *
 *  依赖（全局）：
 *    - utils.js:        icon, escapeHtml
 *    - router.js:       showPage
 *    - realtime-bar.js: rtSession, __rtViewedProtoIds, rtSetAction, updateSessionStats
 *    - logger.js:       window.interactionLog
 *    - muscle-disease.js: illustrationHtml, getIllustration（工具/指南详情插图）
 *    - data.js:         clinicalTools, clinicalGuidelines, rehabProtocols, protocolCategories
 */

(function (global) {
  'use strict';

  // ═══════════════════════════════════════════════════
  //  1. 临床工具
  // ═══════════════════════════════════════════════════

  var currentToolCategory = '全部';

  function renderToolsCategoryBar() {
    var bar = document.getElementById('toolsCategoryBar');
    if (!bar) return;
    var tools = typeof clinicalTools !== 'undefined' ? clinicalTools : [];
    var catSet = {};
    tools.forEach(function (t) { catSet[t.category] = true; });
    var cats = ['全部'].concat(Object.keys(catSet));
    bar.innerHTML = cats.map(function (c) {
      return '<button class="quick-nav-item ' + (c === currentToolCategory ? 'active' : '') + '" onclick="selectToolCategory(\'' + c + '\')">' + c + '</button>';
    }).join('');
  }

  function selectToolCategory(cat) {
    currentToolCategory = cat;
    renderToolsCategoryBar();
    renderToolsList();
  }

  function renderToolsList() {
    var container = document.getElementById('toolsListContainer');
    if (!container) return;
    var tools = typeof clinicalTools !== 'undefined' ? clinicalTools : [];
    var searchEl = document.getElementById('toolsSearch');
    var kw = (searchEl ? searchEl.value : '').trim().toLowerCase();

    var filtered = tools;
    if (currentToolCategory !== '全部') {
      filtered = filtered.filter(function (t) { return t.category === currentToolCategory; });
    }
    if (kw) {
      filtered = filtered.filter(function (t) {
        return (t.name && t.name.toLowerCase().indexOf(kw) >= 0) ||
               ((t.description || '').toLowerCase().indexOf(kw) >= 0);
      });
    }

    if (filtered.length === 0) {
      container.innerHTML = '<div class="empty-state">暂无工具</div>';
      return;
    }

    container.innerHTML = filtered.map(function (t) {
      var idx = tools.indexOf(t);
      return '<div class="list-item" onclick="showToolDetail(' + idx + ')">' +
        '<div class="list-item-content">' +
          '<div class="list-item-title">' + (t.name || '') + '</div>' +
          '<div class="list-item-desc">' + (t.description || '') + '</div>' +
        '</div>' +
        '<div class="list-item-arrow">' + icon('chevronRight', 18) + '</div>' +
      '</div>';
    }).join('');
  }

  function showToolDetail(idx) {
    var tools = typeof clinicalTools !== 'undefined' ? clinicalTools : [];
    var t = tools[idx];
    if (!t) return;

    var pageId = 'tool-detail-' + idx;
    var pageEl = document.getElementById('page-' + pageId);

    if (!pageEl) {
      var contentHtml = '';

      if (t.type === 'calculator' && t.content && t.content.calculate) {
        contentHtml = '<div class="info-banner">计算器工具，请输入参数后点击计算</div>';
        contentHtml += '<div id="calcResult"></div>';
      } else if (t.content.movements) {
        contentHtml = t.content.movements.map(function (m) {
          return '<div class="field-row">' +
            '<div class="field-label">' + (m.name || '') + '</div>' +
            '<div class="field-value">' +
              '<p>正常范围：' + (m.normal || '-') + '</p>' +
              (m.functional ? '<p>功能范围：' + m.functional + '</p>' : '') +
              (m.notes ? '<p>备注：' + m.notes + '</p>' : '') +
            '</div>' +
          '</div>';
        }).join('');
      } else if (t.content.sections) {
        t.content.sections.forEach(function (sec) {
          contentHtml += '<div class="sub-title">' + sec.name + '</div>';
          contentHtml += sec.movements.map(function (m) {
            return '<div class="field-row">' +
              '<div class="field-label">' + (m.name || '') + '</div>' +
              '<div class="field-value">' +
                '<p>正常范围：' + (m.normal || '-') + '</p>' +
                (m.notes ? '<p>备注：' + m.notes + '</p>' : '') +
              '</div>' +
            '</div>';
          }).join('');
        });
      } else if (t.content.grades) {
        contentHtml = t.content.grades.map(function (g) {
          return '<div class="field-row">' +
            '<div class="field-label">' + (g.grade || '') + '</div>' +
            '<div class="field-value"><p>' + (g.description || g.text || '') + '</p></div>' +
          '</div>';
        }).join('');
      } else if (t.content.items) {
        contentHtml = t.content.items.map(function (item) {
          return '<div class="field-row">' +
            '<div class="field-label">' + (item.name || item.reflex || item.level || '') + '</div>' +
            '<div class="field-value"><p>' + (item.description || item.response || item.value || '') + '</p></div>' +
          '</div>';
        }).join('');
      } else if (t.content.parameters) {
        contentHtml = t.content.parameters.map(function (p) {
          return '<div class="field-row">' +
            '<div class="field-label">' + (p.name || '') + '</div>' +
            '<div class="field-value"><p>' + (p.normal || p.value || '') + '</p></div>' +
          '</div>';
        }).join('');
      } else if (t.content.steps) {
        contentHtml = '<ol>' + t.content.steps.map(function (s) { return '<li>' + s + '</li>'; }).join('') + '</ol>';
      } else if (t.content.types) {
        contentHtml = t.content.types.map(function (tp) {
          return '<div class="field-row">' +
            '<div class="field-label">' + (tp.name || '') + '</div>' +
            '<div class="field-value"><p>' + (tp.description || '') + '</p></div>' +
          '</div>';
        }).join('');
      }

      pageEl = document.createElement('div');
      pageEl.className = 'page';
      pageEl.id = 'page-' + pageId;
      pageEl.innerHTML =
        '<div class="detail-header">' +
          '<div class="detail-header-title">' + (t.name || '') + '</div>' +
          '<div class="detail-header-sub">' + (t.category || '') + ' · ' + (t.description || '') + '</div>' +
        '</div>' +
        illustrationHtml(getIllustration(null, (t.name || '') + (t.category || '')), t.name) +
        '<div class="accordion-item open">' +
          '<div class="accordion-content">' + contentHtml + '</div>' +
        '</div>';

      document.getElementById('content').appendChild(pageEl);
    }

    showPage(pageId);
    var titleEl = document.getElementById('navTitle');
    if (titleEl) titleEl.textContent = t.name;
  }

  // ═══════════════════════════════════════════════════
  //  2. 临床指南
  // ═══════════════════════════════════════════════════

  var currentGuidelineCategory = '全部';

  function renderGuidelinesCategoryBar() {
    var bar = document.getElementById('guidelinesCategoryBar');
    if (!bar) return;
    var guidelines = typeof clinicalGuidelines !== 'undefined' ? clinicalGuidelines : [];
    var catSet = {};
    guidelines.forEach(function (g) { catSet[g.category] = true; });
    var cats = ['全部'].concat(Object.keys(catSet));
    bar.innerHTML = cats.map(function (c) {
      return '<button class="quick-nav-item ' + (c === currentGuidelineCategory ? 'active' : '') + '" onclick="selectGuidelineCategory(\'' + c + '\')">' + c + '</button>';
    }).join('');
  }

  function selectGuidelineCategory(cat) {
    currentGuidelineCategory = cat;
    renderGuidelinesCategoryBar();
    renderGuidelinesList();
  }

  function renderGuidelinesList() {
    var container = document.getElementById('guidelinesListContainer');
    if (!container) return;
    var guidelines = typeof clinicalGuidelines !== 'undefined' ? clinicalGuidelines : [];
    var searchEl = document.getElementById('guidelinesSearch');
    var kw = (searchEl ? searchEl.value : '').trim().toLowerCase();

    var filtered = guidelines;
    if (currentGuidelineCategory !== '全部') {
      filtered = filtered.filter(function (g) { return g.category === currentGuidelineCategory; });
    }
    if (kw) {
      filtered = filtered.filter(function (g) {
        return (g.title && g.title.toLowerCase().indexOf(kw) >= 0) ||
               ((g.source || '').toLowerCase().indexOf(kw) >= 0);
      });
    }

    if (filtered.length === 0) {
      container.innerHTML = '<div class="empty-state">暂无指南</div>';
      return;
    }

    container.innerHTML = filtered.map(function (g) {
      var idx = guidelines.indexOf(g);
      var recCount = g.recommendations ? g.recommendations.length : 0;
      return '<div class="list-item" onclick="showGuidelineDetail(' + idx + ')">' +
        '<div class="list-item-content">' +
          '<div class="list-item-title">' + (g.title || '') + '</div>' +
          '<div class="list-item-desc">' + (g.source || '') + ' · ' + (g.year || '') + ' · ' + recCount + '条推荐</div>' +
        '</div>' +
        '<div class="list-item-arrow">' + icon('chevronRight', 18) + '</div>' +
      '</div>';
    }).join('');
  }

  function showGuidelineDetail(idx) {
    var guidelines = typeof clinicalGuidelines !== 'undefined' ? clinicalGuidelines : [];
    var g = guidelines[idx];
    if (!g) return;

    var pageId = 'guideline-detail-' + idx;
    var pageEl = document.getElementById('page-' + pageId);

    if (!pageEl) {
      var recHtml = '';
      if (g.recommendations && g.recommendations.length > 0) {
        recHtml = g.recommendations.map(function (r) {
          return '<div class="field-row">' +
            '<div class="field-label">' + (r.level ? '证据等级 ' + r.level : '推荐') + '</div>' +
            '<div class="field-value"><p>' + (r.text || r.content || '') + '</p></div>' +
          '</div>';
        }).join('');
      }

      var scaleHtml = '';
      if (g.relatedScales && g.relatedScales.length > 0) {
        scaleHtml = '<div class="sub-title">关联量表</div><div style="display:flex;flex-wrap:wrap;gap:6px;">' +
          g.relatedScales.map(function (s) {
            return '<span class="detail-tag" style="background:rgba(37,99,235,0.1);color:var(--primary);">' + s + '</span>';
          }).join('') +
        '</div>';
      }

      var recCount = g.recommendations ? g.recommendations.length : 0;
      pageEl = document.createElement('div');
      pageEl.className = 'page';
      pageEl.id = 'page-' + pageId;
      pageEl.innerHTML =
        '<div class="detail-header">' +
          '<div class="detail-header-title">' + (g.title || '') + '</div>' +
          '<div class="detail-header-sub">' + (g.source || '') + ' · ' + (g.year || '') + '</div>' +
          '<div class="detail-tags"><span class="detail-tag">' + (g.category || '') + '</span></div>' +
        '</div>' +
        illustrationHtml('medical-anatomy-skeleton', g.title) +
        '<div class="accordion-item open">' +
          '<div class="accordion-header" style="cursor:default;">' +
            '<div class="accordion-header-top">' +
              icon('evidence', 22) +
              '<div class="accordion-title">核心推荐 (' + recCount + '条)</div>' +
            '</div>' +
          '</div>' +
          '<div class="accordion-body">' +
            '<div class="accordion-content">' + recHtml + '</div>' +
          '</div>' +
        '</div>' +
        (scaleHtml ? '<div class="accordion-item open"><div class="accordion-content">' + scaleHtml + '</div></div>' : '');

      document.getElementById('content').appendChild(pageEl);
    }

    showPage(pageId);
    var titleEl = document.getElementById('navTitle');
    if (titleEl) titleEl.textContent = g.title;
  }

  // ═══════════════════════════════════════════════════
  //  3. 康复方案
  // ═══════════════════════════════════════════════════

  var currentProtocolCat = 'ALL';
  // 当前查看的方案（用于交互日志埋点上下文）
  var currentProtocol = null;

  function renderProtocolCatBar() {
    var bar = document.getElementById('protocolCatBar');
    if (!bar) return;
    var cats = [{ id: 'ALL', name: '全部' }].concat(
      (typeof protocolCategories !== 'undefined' ? protocolCategories : [])
    );
    bar.innerHTML = cats.map(function (c) {
      return '<div class="protocol-cat-chip' + (c.id === currentProtocolCat ? ' active' : '') + '" data-cat="' + c.id + '">' + c.name + '</div>';
    }).join('');
    bar.querySelectorAll('.protocol-cat-chip').forEach(function (el) {
      el.addEventListener('click', function () {
        currentProtocolCat = this.dataset.cat;
        renderProtocolCatBar();
        renderProtocolList();
      });
    });
  }

  function renderProtocolList() {
    var container = document.getElementById('protocolListContainer');
    if (!container) return;
    var searchEl = document.getElementById('protocolSearch');
    var search = (searchEl ? searchEl.value : '') || '';
    search = search.toLowerCase();

    var protocols = typeof rehabProtocols !== 'undefined' ? rehabProtocols : [];
    var filtered = protocols.filter(function (p) {
      var catMatch = currentProtocolCat === 'ALL' || p.category === currentProtocolCat;
      var searchMatch = !search ||
        (p.name && p.name.toLowerCase().indexOf(search) >= 0) ||
        (p.description && p.description.toLowerCase().indexOf(search) >= 0) ||
        (p.evidence && p.evidence.toLowerCase().indexOf(search) >= 0);
      return catMatch && searchMatch;
    });

    if (filtered.length === 0) {
      container.innerHTML = '<div class="dashboard-empty">暂无匹配方案</div>';
      return;
    }

    container.innerHTML = filtered.map(function (p) {
      var stageTags = (p.stages || []).map(function (s) {
        return '<span class="protocol-stage-tag">' + s.name.split('：')[0].split('（')[0] + '</span>';
      }).join('');
      var desc = p.description || (p.isPain ? '针对' + p.name + '的分阶段疼痛管理方案，涵盖病因分析与分期干预。' : '');
      var painBadge = p.isPain
        ? ' <span style="display:inline-block;padding:2px 8px;background:linear-gradient(135deg,var(--status-error-default),#dc2626);color:#fff;font-size:11px;font-weight:600;border-radius:20px;margin-left:4px;">疼痛</span>'
        : '';
      return '<div class="protocol-card" data-id="' + p.id + '">' +
        '<div class="protocol-card-header">' +
          '<div class="protocol-card-icon" data-cat="' + p.category + '">' + icon(p.icon || 'protocol', 26) + '</div>' +
          '<div class="protocol-card-info">' +
            '<div class="protocol-card-title">' + p.name + '</div>' +
            '<div class="protocol-card-evidence">循证来源：' + (p.evidence || '临床实践共识') + '</div>' +
          '</div>' +
        '</div>' +
        '<div class="protocol-card-desc">' + desc + '</div>' +
        '<span class="protocol-card-badge" data-cat="' + p.category + '">' + (p.categoryName || '') + '</span>' +
        (p.isPro ? ' <span class="pro-badge">PRO</span>' : '') +
        painBadge +
        '<div class="protocol-card-stages">' + stageTags + '</div>' +
      '</div>';
    }).join('');

    container.querySelectorAll('.protocol-card').forEach(function (el) {
      el.addEventListener('click', function () {
        showProtocolDetail(this.dataset.id);
      });
    });
  }

  function showProtocolDetail(id) {
    var protocols = typeof rehabProtocols !== 'undefined' ? rehabProtocols : [];
    var p = protocols.find(function (x) { return x.id === id; });
    if (!p) return;

    // 更新实时操作栏（realtime-bar.js 提供的全局变量/函数）
    if (typeof rtSession !== 'undefined') rtSession.protocols++;
    if (typeof __rtViewedProtoIds !== 'undefined') __rtViewedProtoIds.add(p.id);
    if (typeof rtSetAction === 'function') rtSetAction('查看方案: ' + p.name);
    if (typeof updateSessionStats === 'function') updateSessionStats();

    // 记录当前方案，供 highlightStageRow 日志埋点使用
    currentProtocol = p;
    if (global.interactionLog) {
      global.interactionLog.info('protocol.detail.open', {
        protocolId: p.id,
        protocolName: p.name,
        stageCount: (p.stages || []).length,
        timestamp: new Date().toISOString()
      });
    }

    var container = document.getElementById('page-protocol-detail');
    if (!container) {
      container = document.createElement('div');
      container.className = 'page';
      container.id = 'page-protocol-detail';
      document.getElementById('content').appendChild(container);
    }

    showPage('protocol-detail', true);

    var stagesHtml = (p.stages || []).map(function (s, i) {
      var exercises = (s.exercises || []).map(function (e) {
        return '<li class="stage-exercise-item">' + e + '</li>';
      }).join('');
      var caution = s.cautions ? '<div class="stage-caution"><strong>⚠ 注意事项</strong><br>' + s.cautions + '</div>' : '';
      var criteria = s.criteria ? '<div class="stage-criteria"><strong>✓ 进阶标准</strong><br>' + s.criteria + '</div>' : '';
      return '<div class="stage-card" data-stage-index="' + i + '">' +
        '<div class="stage-header" onclick="this.nextElementSibling.classList.toggle(\'open\');this.querySelector(\'.stage-arrow\').classList.toggle(\'open\')">' +
          '<div class="stage-number">' + (i + 1) + '</div>' +
          '<div class="stage-name">' + s.name + '</div>' +
          '<span class="icon stage-arrow" style="width:20px;height:20px;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg></span>' +
        '</div>' +
        '<div class="stage-content open">' +
          '<div class="stage-goal"><strong>目标</strong>：' + (s.goal || '') + '</div>' +
          '<div class="stage-duration">时长：' + (s.duration || '') + '</div>' +
          '<ul class="stage-exercise-list">' + exercises + '</ul>' +
          caution + criteria +
        '</div>' +
      '</div>';
    }).join('');

    // 疼痛方案附加信息
    var extraHtml = '';
    if (p.causes && p.causes.length > 0) {
      extraHtml += '<div style="padding:0 16px 4px;"><div class="stage-caution" style="background:rgba(239,68,68,0.08);border-left:3px solid var(--status-error-default);"><strong>病因因素</strong><br>' +
        p.causes.map(function (c) { return '• ' + c; }).join('<br>') + '</div></div>';
    }
    if (p.symptoms && p.symptoms.length > 0) {
      extraHtml += '<div style="padding:4px 16px 4px;"><div class="stage-caution" style="background:rgba(245,158,11,0.08);border-left:3px solid var(--accent-amber);"><strong>临床表现</strong><br>' +
        p.symptoms.map(function (s) { return '• ' + s; }).join('<br>') + '</div></div>';
    }
    if (p.evaluation) {
      extraHtml += '<div style="padding:4px 16px 4px;"><div class="stage-caution" style="background:rgba(37,99,235,0.08);border-left:3px solid #2563eb;"><strong>评估方法</strong><br>' + p.evaluation + '</div></div>';
    }

    // 阶段概览表格（点击高亮 + 滚动联动）
    var overviewHtml = '';
    if (p.stages && p.stages.length > 0) {
      var overviewRows = p.stages.map(function (s, i) {
        var topExercises = (s.exercises || []).slice(0, 3).map(function (e) {
          var shortName = e.split('：')[0].split('（')[0];
          if (shortName.length > 20) shortName = shortName.substring(0, 20) + '...';
          return '<li>' + shortName + '</li>';
        }).join('');
        var stageNameShort = s.name.split('（')[0].split('：')[0];
        var durationMatch = s.name.match(/（([^）]+)）/);
        var durationText = durationMatch ? durationMatch[1] : (s.duration || '');
        var criteriaShort = s.criteria ? (s.criteria.length > 15 ? s.criteria.substring(0, 15) + '...' : s.criteria) : '—';
        var freqClass = 'mid';
        var freqText = s.duration || '—';
        if (freqText.indexOf('每日') >= 0 || freqText.indexOf('每天') >= 0) { freqClass = 'high'; }
        else if (freqText.indexOf('每周') >= 0 && freqText.indexOf('每周 2') < 0) { freqClass = 'mid'; }
        else if (freqText.indexOf('周以后') >= 0 || freqText.indexOf('每周 2') >= 0) { freqClass = 'low'; }

        return '<tr onclick="highlightStageRow(this, ' + i + ')">' +
          '<td data-label="#"><span class="stage-overview-num">' + (i + 1) + '</span></td>' +
          '<td data-label="阶段"><div class="stage-overview-name">' + stageNameShort + '</div>' +
          (durationText ? '<div class="stage-overview-duration">' + durationText + '</div>' : '') + '</td>' +
          '<td class="stage-overview-goal" data-label="治疗目标">' + (s.goal || '') + '</td>' +
          '<td class="stage-overview-exercises" data-label="核心训练动作"><ul>' + topExercises + '</ul></td>' +
          '<td data-label="频率"><span class="freq-tag ' + freqClass + '">' + freqText + '</span></td>' +
          '<td data-label="进阶标准" style="font-size:11px;color:var(--accent-green, #10B981);">' + criteriaShort + '</td>' +
        '</tr>';
      }).join('');

      overviewHtml = '<div style="padding:0 16px 16px;">' +
        '<div class="stage-overview">' +
          '<div class="stage-overview-title">📋 康复阶段概览(' + p.stages.length + ' 个阶段)</div>' +
          '<div class="stage-overview-scroll">' +
          '<table class="stage-overview-table">' +
            '<thead><tr>' +
              '<th style="width:28px;">#</th>' +
              '<th style="width:90px;">阶段</th>' +
              '<th>治疗目标</th>' +
              '<th>核心训练动作</th>' +
              '<th style="width:70px;">频率</th>' +
              '<th style="width:80px;">进阶标准</th>' +
            '</tr></thead>' +
            '<tbody>' + overviewRows + '</tbody>' +
          '</table>' +
          '</div>' +
        '</div>' +
      '</div>';
    }

    var painBadge = p.isPain
      ? ' <span style="display:inline-block;padding:2px 8px;background:linear-gradient(135deg,var(--status-error-default),#dc2626);color:#fff;font-size:11px;font-weight:600;border-radius:20px;">疼痛</span>'
      : '';
    var proBadge = p.isPro ? ' <span class="pro-badge">PRO</span>' : '';
    var desc = p.description || (p.isPain ? '针对' + p.name + '的分阶段疼痛管理方案，涵盖病因分析、临床表现与分期干预。' : '');

    container.innerHTML = '<div class="protocol-detail">' +
      '<div class="protocol-detail-header">' +
        '<div class="protocol-detail-title">' + p.name + proBadge + painBadge + '</div>' +
        '<div class="protocol-detail-evidence">循证来源：' + (p.evidence || '临床实践共识') + '</div>' +
        '<div class="protocol-detail-desc">' + desc + '</div>' +
        '<span class="protocol-card-badge" data-cat="' + p.category + '" style="margin-top:8px;">' + (p.categoryName || '') + '</span>' +
      '</div>' +
      extraHtml +
      overviewHtml +
      '<div style="padding:0 16px 20px;">' + stagesHtml + '</div>' +
    '</div>';

    container.classList.add('active');
    container.classList.add('fade-in');
    setTimeout(function () { container.classList.remove('fade-in'); }, 200);
    var contentEl = document.getElementById('content');
    if (contentEl) contentEl.scrollTop = 0;
    var navBack = document.getElementById('navBack');
    if (navBack) navBack.style.display = 'flex';
  }

  /**
   * 阶段概览表格行点击：高亮 + 滚动联动到对应详细卡片
   * @param {HTMLElement} row - 被点击的表格行
   * @param {number} stageIndex - 阶段索引
   */
  function highlightStageRow(row, stageIndex) {
    var protocolId = currentProtocol ? currentProtocol.id : null;
    var protocolName = currentProtocol ? currentProtocol.name : null;
    var willHighlight = !row.classList.contains('highlight');

    var tbody = row.parentNode;
    if (tbody) {
      tbody.querySelectorAll('tr.highlight').forEach(function (r) {
        if (r !== row) r.classList.remove('highlight');
      });
    }
    row.classList.toggle('highlight');

    if (global.interactionLog) {
      global.interactionLog.info('stage.row.click', {
        stageIndex: stageIndex,
        protocolId: protocolId,
        protocolName: protocolName,
        action: willHighlight ? 'select' : 'deselect',
        timestamp: new Date().toISOString()
      });
    }

    if (stageIndex === undefined) {
      if (global.interactionLog) global.interactionLog.warn('stage.row.click.noIndex', { protocolId: protocolId });
      return;
    }
    var card = document.querySelector('.stage-card[data-stage-index="' + stageIndex + '"]');
    if (!card) {
      if (global.interactionLog) {
        global.interactionLog.error('stage.row.click.cardNotFound', {
          stageIndex: stageIndex,
          protocolId: protocolId,
          selector: '.stage-card[data-stage-index="' + stageIndex + '"]'
        });
      }
      return;
    }

    var content = card.querySelector('.stage-content');
    var wasOpen = content && content.classList.contains('open');
    if (content && !wasOpen) {
      content.classList.add('open');
      var arrow = card.querySelector('.stage-arrow');
      if (arrow) arrow.classList.add('open');
    }

    // 触发高亮脉冲动画
    card.classList.remove('stage-card-pulse');
    void card.offsetWidth;
    card.classList.add('stage-card-pulse');

    var origTransition = card.style.transition;
    var origBg = card.style.backgroundColor;
    card.style.transition = 'background-color 0.4s ease';
    card.style.backgroundColor = 'rgba(255, 193, 7, 0.35)';
    setTimeout(function () {
      card.style.backgroundColor = origBg;
      setTimeout(function () { card.style.transition = origTransition; }, 400);
    }, 700);

    var contentEl = document.getElementById('content');
    var cardTop = card.getBoundingClientRect().top;
    var containerTop = contentEl ? contentEl.getBoundingClientRect().top : 0;
    var offset = cardTop - containerTop + (contentEl ? contentEl.scrollTop : window.scrollY) - 80;
    if (offset < 0) offset = 0;

    var scrollBefore = contentEl ? contentEl.scrollTop : window.scrollY;
    var scrollContainer = contentEl ? 'content' : 'window';

    try {
      (contentEl || window).scrollTo({ top: offset, behavior: 'smooth' });
    } catch (e) {
      if (contentEl) contentEl.scrollTop = offset;
      else window.scrollTo(0, offset);
      if (global.interactionLog) {
        global.interactionLog.warn('stage.scroll.fallback', {
          stageIndex: stageIndex, reason: 'scrollTo-options-unsupported', error: e.message
        });
      }
    }

    setTimeout(function () {
      var scrollAfter = contentEl ? contentEl.scrollTop : window.scrollY;
      if (Math.abs(scrollAfter - offset) > 10 && Math.abs(scrollAfter - scrollBefore) < 10) {
        if (contentEl) contentEl.scrollTop = offset;
        else window.scrollTo(0, offset);
        if (global.interactionLog) {
          global.interactionLog.warn('stage.scroll.fallback', {
            stageIndex: stageIndex, reason: 'smooth-no-effect',
            before: scrollBefore, after: scrollAfter, target: Math.round(offset)
          });
        }
      }
    }, 300);

    if (global.interactionLog) {
      global.interactionLog.info('stage.scroll.link', {
        stageIndex: stageIndex,
        protocolId: protocolId,
        cardFound: true,
        cardExpanded: !wasOpen,
        scrollTarget: Math.round(offset),
        scrollBefore: Math.round(scrollBefore),
        scrollContainer: scrollContainer,
        timestamp: new Date().toISOString()
      });
    }
  }

  // ═══════════════════════════════════════════════════
  //  4. 挂载到 window（内联 onclick 调用需要）
  // ═══════════════════════════════════════════════════

  global.renderToolsCategoryBar = renderToolsCategoryBar;
  global.selectToolCategory = selectToolCategory;
  global.renderToolsList = renderToolsList;
  global.showToolDetail = showToolDetail;
  global.renderGuidelinesCategoryBar = renderGuidelinesCategoryBar;
  global.selectGuidelineCategory = selectGuidelineCategory;
  global.renderGuidelinesList = renderGuidelinesList;
  global.showGuidelineDetail = showGuidelineDetail;
  global.renderProtocolCatBar = renderProtocolCatBar;
  global.renderProtocolList = renderProtocolList;
  global.showProtocolDetail = showProtocolDetail;
  global.highlightStageRow = highlightStageRow;
})(typeof window !== 'undefined' ? window : this);
