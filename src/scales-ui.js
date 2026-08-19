/**
 * scales-ui.js — 评估流程模块
 * 量表库/答题/结果/历史/趋势图/导出
 * 状态变量(currentScale 等)与基础函数(filterScales/renderScaleList)留 index.html，IIFE 闭包访问
 */
(function(global){
'use strict';

function renderScaleLibrary() {
  const container = document.getElementById('scaleListContainer');
  if (!container) {
    window.interactionLog && window.interactionLog.warn('scale.library.render.noContainer', {
      timestamp: new Date().toISOString()
    });
    return;
  }

  var searchKw = '';
  var searchEl = document.getElementById('scaleSearch');
  if (searchEl) searchKw = searchEl.value;
  var kwTrimmed = (searchKw || '').trim();
  var hasKeyword = kwTrimmed.length > 0;
  var hasCategory = currentScaleCategory && currentScaleCategory !== '全部';

  var allScales = typeof assessmentScales !== 'undefined' ? assessmentScales : [];
  // 复用纯函数 filterScales，保证渲染与测试逻辑一致
  var filtered = filterScales(allScales, currentScaleCategory, searchKw);

  // 统计当前分类下量表总数（用于区分"分类无量表" vs "搜索无匹配"）
  var scalesInCategory = hasCategory ? allScales.filter(function(s) { return s.category === currentScaleCategory; }).length : allScales.length;

  // 埋点：筛选结果统计（搜索 + 分类组合）
  window.interactionLog && window.interactionLog.info('scale.library.filter', {
    category: currentScaleCategory,
    keyword: kwTrimmed,
    totalScales: allScales.length,
    scalesInCategory: scalesInCategory,
    matchedCount: filtered.length,
    timestamp: new Date().toISOString()
  });

  if (filtered.length === 0) {
    // 空结果用 warn 级别，便于排查；细分两种场景
    var emptyReason = !hasKeyword && hasCategory && scalesInCategory === 0
      ? 'category-empty'                 // 该分类本身无量表
      : hasKeyword && scalesInCategory === 0
        ? 'category-empty-with-keyword'  // 该分类无量表且有关键词（分类问题为主）
        : hasKeyword
          ? 'keyword-no-match'           // 分类有量表，但关键词未命中
          : 'unknown';                   // 兜底
    window.interactionLog && window.interactionLog.warn('scale.library.empty', {
      category: currentScaleCategory,
      keyword: kwTrimmed,
      totalScales: allScales.length,
      scalesInCategory: scalesInCategory,
      reason: emptyReason,
      timestamp: new Date().toISOString()
    });
    container.innerHTML = '<div class="dashboard-empty">未找到匹配的量表<br>试试其他关键词或分类</div>';
    return;
  }

  // 按分类分组
  const categories = {};
  filtered.forEach(function(s) {
    if (!categories[s.category]) categories[s.category] = [];
    categories[s.category].push(s);
  });

  let html = '';
  const catOrder = ['pain', 'neck', 'back', 'upper', 'wrist', 'lower', 'ankle', 'function', 'balance', 'quality', 'muscle', 'mental', '平衡', '运动功能', '肌力与痉挛', '关节活动度', '日常生活', '认知与心理', '吞咽与言语'];

  catOrder.forEach(cat => {
    if (!categories[cat]) return;
    const scales = categories[cat];
    const catInfo = scaleCategoryInfo[cat] || { name: cat, icon: 'other' };

    html +=
      '<div class="scale-category">' +
        '<div class="scale-category-title">' +
          icon(catInfo.icon, 18) +
          catInfo.name + ' (' + scales.length + ')' +
        '</div>';

    scales.forEach(scale => {
      const proBadge = scale.isPro ? '<span class="pro-badge">PRO</span>' : '';
      html +=
        '<div class="list-item" onclick="startScale(\'' + scale.id + '\')">' +
          icon(catInfo.icon, 36) +
          '<div class="list-item-content">' +
            '<div class="list-item-title">' + scale.name + proBadge + '</div>' +
            '<div class="list-item-desc">' + (scale.description || '') + '</div>' +
          '</div>' +
          '<div class="list-item-arrow">' + icon('chevronRight', 18) + '</div>' +
        '</div>';
    });

    html += '</div>';
  });

  container.innerHTML = html;
}

function startScale(scaleId) {
  const scale = assessmentScales.find(s => s.id === scaleId);
  if (!scale) return;
  
  currentScale = scale;
  currentScaleAnswers = [];
  currentScaleChoiceIdx = [];

  const totalQuestions = scale.type === 'slider' || scale.type === 'number' ? 1 :
    scale.type === 'yesno' ? scale.questions.length :
    scale.questions ? scale.questions.length : 1;

  for (let i = 0; i < totalQuestions; i++) {
    currentScaleAnswers.push(null);
    currentScaleChoiceIdx.push(null);
  }

  showScaleIntro();
}

/**
 * 判断量表是否有循证数据
 */
function hasEvidenceData(scale) {
  return !!(scale && scale.evidence && typeof scale.evidence === 'object' && Object.keys(scale.evidence).length > 0);
}

/**
 * 渲染循证数据为 HTML 表格
 * 只渲染存在的字段，缺失字段自动跳过
 */
function renderEvidenceHtml(scale) {
  if (!hasEvidenceData(scale)) {
    window.interactionLog && window.interactionLog.debug('evidence.render.skip', { scaleId: scale && scale.id, reason: 'no-evidence' });
    return '';
  }

  var ev = scale.evidence;
  var rows = [];
  var renderedFields = [];

  if (ev.sensitivity) {
    rows.push('<tr><td>敏感度</td><td>' + ev.sensitivity + '</td><td>真阳性率，越高越不漏诊</td></tr>');
    renderedFields.push('sensitivity');
  }
  if (ev.specificity) {
    rows.push('<tr><td>特异度</td><td>' + ev.specificity + '</td><td>真阴性率，越高越不误诊</td></tr>');
    renderedFields.push('specificity');
  }
  if (ev.mcid !== undefined && ev.mcid !== null) {
    rows.push('<tr><td>MCID</td><td>' + ev.mcid + ' 分</td><td>最小临床重要差异</td></tr>');
    renderedFields.push('mcid');
  }
  if (ev.reliability) {
    rows.push('<tr><td>内部一致性</td><td>' + ev.reliability + '</td><td>Cronbach α，≥0.8 为良好</td></tr>');
    renderedFields.push('reliability');
  }
  if (ev.testRetest) {
    rows.push('<tr><td>重测信度</td><td>' + ev.testRetest + '</td><td>ICC，≥0.75 为良好</td></tr>');
    renderedFields.push('testRetest');
  }
  if (ev.source) {
    var yearSuffix = ev.year ? ' (' + ev.year + ')' : '';
    rows.push('<tr><td>文献来源</td><td colspan="2">' + ev.source + yearSuffix + '</td></tr>');
    renderedFields.push('source');
  }

  if (rows.length === 0) {
    window.interactionLog && window.interactionLog.warn('evidence.render.empty', { scaleId: scale.id, reason: 'has-object-no-fields' });
    return '';
  }

  // 埋点：循证数据渲染事件
  window.interactionLog && window.interactionLog.info('evidence.render', {
    scaleId: scale.id,
    scaleName: scale.name,
    fields: renderedFields,
    fieldCount: renderedFields.length,
    timestamp: new Date().toISOString()
  });

  return '<div class="result-detail-section">' +
    '<div class="result-detail-title">' + icon('evidence', 18) + '循证数据</div>' +
    '<table class="evidence-table"><tbody>' + rows.join('') + '</tbody></table>' +
    '</div>';
}

function showScaleIntro() {
  const scale = currentScale;
  const content = 
    '<div class="result-detail-section">' +
      '<div class="result-detail-title">' + icon('basics', 18) + '量表介绍</div>' +
      '<p style="font-size:14px;color:var(--text-2);line-height:1.7;">' + (scale.description || '') + '</p>' +
    '</div>' +
    '<div class="result-detail-section">' +
      '<div class="result-detail-title">' + icon('evidence', 18) + '信效度</div>' +
      '<p style="font-size:14px;color:var(--text-2);line-height:1.7;">' + (scale.reliability || '') + '</p>' +
    '</div>' +
    renderEvidenceHtml(scale) +
    '<div class="result-detail-section">' +
      '<div class="result-detail-title">' + icon('list', 18) + '参考来源</div>' +
      '<p style="font-size:14px;color:var(--text-2);line-height:1.7;">' + (scale.reference || '') + '</p>' +
    '</div>' +
    '<div class="info-banner">' +
      icon('warning', 16) + ' 本评估工具仅供参考，不能替代专业医疗诊断。如有不适请及时就医。' +
    '</div>';
  
  const footer = 
    '<button class="btn btn-primary btn-block" onclick="showScaleQuestion(0)">' +
      icon('plus', 18) + '开始评估' +
    '</button>';
  
  showModal(scale.name, content, footer);
}

function showScaleQuestion(index) {
  const scale = currentScale;
  const modalBody = document.getElementById('modalBody');
  if (!modalBody) return;
  
  let content = '';
  
  if (scale.type === 'slider') {
    const val = currentScaleAnswers[0] !== null ? currentScaleAnswers[0] : 5;
    if (currentScaleAnswers[0] === null) currentScaleAnswers[0] = val;
    content = 
      '<div class="scale-question">' +
        '<div class="scale-question-text">' + (scale.question || '') + '</div>' +
        '<div class="scale-score-display" id="sliderValue">' + val + ' 分</div>' +
        '<div class="scale-slider">' +
          '<input type="range" id="scaleSlider" min="' + (scale.min || 0) + '" max="' + (scale.max || 10) + '" value="' + escapeAttr(val) + '" step="1" oninput="updateSliderValue(this.value)">' +
          '<div class="scale-slider-labels">' +
            '<span>' + (scale.labels ? scale.labels[0] : '0') + '</span>' +
            '<span>' + (scale.labels ? scale.labels[1] : '10') + '</span>' +
          '</div>' +
        '</div>' +
      '</div>';
  } else if (scale.type === 'number' && !scale.questions) {
    const val = currentScaleAnswers[0] !== null ? currentScaleAnswers[0] : '';
    content = 
      '<div class="scale-question">' +
        '<div class="scale-question-text">' + (scale.question || '') + '</div>' +
        '<div class="form-group">' +
          '<input type="number" class="form-input" id="numberInput" value="' + escapeAttr(val) + '" placeholder="请输入分数" min="' + (scale.min || 0) + '" max="' + (scale.max || 100) + '" oninput="currentScaleAnswers[0]=parseFloat(this.value)||0">' +
        '</div>' +
      '</div>';
  } else if (scale.type === 'number' && scale.customQuestions) {
    content = '<div class="info-banner">' + (scale.instruction || '') + '</div>';
    for (let i = 0; i < (scale.questionCount || 3); i++) {
      if (currentScaleAnswers[i * 2 + 1] === null || currentScaleAnswers[i * 2 + 1] === undefined) {
        currentScaleAnswers[i * 2 + 1] = 5;
      }
      const activity = currentScaleAnswers[i * 2] || '';
      const score = currentScaleAnswers[i * 2 + 1] !== undefined ? currentScaleAnswers[i * 2 + 1] : 5;
      content += 
        '<div class="psfs-input-group">' +
          '<div class="form-label">活动 ' + (i + 1) + '</div>' +
          '<input type="text" class="form-input psfs-activity-input" placeholder="请输入活动名称" value="' + escapeAttr(activity) + '" oninput="currentScaleAnswers[' + (i * 2) + ']=this.value">' +
          '<div class="psfs-slider">' +
            '<div style="display:flex;justify-content:space-between;font-size:12px;color:var(--text-3);margin-bottom:4px;">' +
              '<span>0分 完全不能做</span>' +
              '<span id="psfsScore' + i + '">' + score + ' 分</span>' +
              '<span>10分 正常</span>' +
            '</div>' +
            '<input type="range" min="0" max="10" value="' + escapeAttr(score) + '" step="1" style="width:100%;" oninput="updatePsfsScore(' + i + ', this.value)">' +
          '</div>' +
        '</div>';
    }
  } else if (scale.type === 'number' && scale.questions) {
    for (let i = 0; i < scale.questions.length; i++) {
      const q = scale.questions[i];
      const val = currentScaleAnswers[i] !== null ? currentScaleAnswers[i] : '';
      content += 
        '<div class="scale-question">' +
          '<div class="scale-question-num">第 ' + (i + 1) + ' 题</div>' +
          '<div class="scale-question-text">' + q.text + '</div>' +
          '<input type="number" class="form-input" placeholder="' + escapeAttr(q.placeholder || '请输入') + '" value="' + escapeAttr(val) + '" min="' + (q.min || 0) + '" max="' + (q.max || 360) + '" oninput="currentScaleAnswers[' + i + ']=parseFloat(this.value)||0">' +
        '</div>';
    }
  } else if (scale.type === 'yesno') {
    for (let i = 0; i < scale.questions.length; i++) {
      const checked = currentScaleAnswers[i] ? true : false;
      content += 
        '<div class="yesno-option ' + (checked ? 'selected' : '') + '" onclick="toggleYesNo(' + i + ')">' +
          '<div class="yesno-checkbox"></div>' +
          '<span>' + scale.questions[i] + '</span>' +
        '</div>';
    }
  } else if (scale.type === 'choice' && scale.questions) {
    const q = scale.questions[index];
    content = 
      '<div class="scale-question">' +
        '<div class="scale-question-num">第 ' + (index + 1) + ' / ' + scale.questions.length + ' 题</div>' +
        '<div class="scale-question-text">' + q.text + '</div>' +
        '<div class="scale-options">';
    
    for (let oi = 0; oi < q.options.length; oi++) {
      const selected = currentScaleChoiceIdx[index] === oi;
      content +=
        '<div class="scale-option ' + (selected ? 'selected' : '') + '" onclick="selectOption(' + index + ', ' + oi + ', ' + q.scores[oi] + ')">' +
          q.options[oi] +
        '</div>';
    }
    
    content += '</div></div>';
    
    const progress = ((index + 1) / scale.questions.length * 100).toFixed(0);
    content += 
      '<div style="margin-top:16px;">' +
        '<div style="display:flex;justify-content:space-between;font-size:12px;color:var(--text-3);margin-bottom:6px;">' +
          '<span>进度</span>' +
          '<span>' + progress + '%</span>' +
        '</div>' +
        '<div style="height:6px;background:var(--bg-3);border-radius:3px;">' +
          '<div style="height:100%;width:' + progress + '%;background:var(--primary);border-radius:3px;"></div>' +
        '</div>' +
      '</div>';
  }
  
  let footer = '';
  if (scale.type === 'choice' && scale.questions && scale.questions.length > 1) {
    const isLast = index >= scale.questions.length - 1;
    const canNext = currentScaleAnswers[index] !== null;
    
    footer = 
      '<button class="btn btn-outline" onclick="' + (index > 0 ? 'showScaleQuestion(' + (index - 1) + ')' : 'showScaleIntro()') + '">' +
        icon('back', 16) + '上一题' +
      '</button>' +
      '<button class="btn btn-primary" ' + (isLast ? '' : (!canNext ? 'disabled style="opacity:0.5;"' : '')) + ' onclick="' + 
        (isLast ? 'submitScale()' : ('showScaleQuestion(' + (index + 1) + ')')) + '">' +
        (isLast ? (icon('check', 16) + '完成评估') : ('下一题' + icon('chevronRight', 16))) +
      '</button>';
  } else {
    footer = 
      '<button class="btn btn-outline" onclick="showScaleIntro()">' +
        icon('back', 16) + '返回' +
      '</button>' +
      '<button class="btn btn-primary" onclick="submitScale()">' +
        icon('check', 16) + '查看结果' +
      '</button>';
  }
  
  modalBody.innerHTML = content;
  const modal = document.getElementById('currentModal');
  if (modal) {
    modal.querySelector('.modal-title').textContent = scale.name;
    let footerEl = modal.querySelector('.modal-footer');
    if (footer) {
      if (!footerEl) {
        const bodyEl = modal.querySelector('.modal-body');
        footerEl = document.createElement('div');
        footerEl.className = 'modal-footer';
        bodyEl.parentNode.insertBefore(footerEl, bodyEl.nextSibling);
      }
      footerEl.innerHTML = footer;
    }
  }
}

function updateSliderValue(val) {
  currentScaleAnswers[0] = parseInt(val);
  const el = document.getElementById('sliderValue');
  if (el) el.textContent = val + ' 分';
}

function updatePsfsScore(index, val) {
  currentScaleAnswers[index * 2 + 1] = parseInt(val);
  const el = document.getElementById('psfsScore' + index);
  if (el) el.textContent = val + ' 分';
}

function selectOption(qIndex, oi, score) {
  currentScaleAnswers[qIndex] = score;
  currentScaleChoiceIdx[qIndex] = oi;
  showScaleQuestion(qIndex);
}

function toggleYesNo(index) {
  currentScaleAnswers[index] = !currentScaleAnswers[index];
  showScaleQuestion(0);
}

function submitScale() {
  const scale = currentScale;
  let result;
  
  if (scale.customQuestions) {
    const scores = [];
    const activities = [];
    for (let i = 0; i < (scale.questionCount || 3); i++) {
      activities.push(currentScaleAnswers[i * 2] || ('活动' + (i + 1)));
      scores.push(currentScaleAnswers[i * 2 + 1] || 0);
    }
    result = scale.calculate(scores, activities);
    result.activities = activities;
  } else {
    result = scale.calculate(currentScaleAnswers);
  }
  
  showScaleResult(result);
}

function showScaleResult(result) {
  const scale = currentScale;
  const interp = getInterpretation(result.score, result.maxScore, scale.interpretation);
  
  let content = 
    '<div class="result-card">' +
      '<div class="result-score">' + result.score + ' <small>/ ' + result.maxScore + ' 分</small></div>' +
      '<div class="result-level ' + interp.color + '">' + interp.level + '</div>' +
      '<div class="result-desc">' + interp.desc + '</div>' +
    '</div>';
  
  if (result.detail) {
    content += 
      '<div class="result-detail-section">' +
        '<div class="result-detail-title">' + icon('list', 18) + '详细说明</div>' +
        '<p style="font-size:14px;color:var(--text-2);line-height:1.7;">' + result.detail + '</p>' +
      '</div>';
  }
  
  if (result.activities) {
    content += 
      '<div class="result-detail-section">' +
        '<div class="result-detail-title">' + icon('list', 18) + '各活动评分</div>';
    for (let i = 0; i < result.activities.length; i++) {
      const activity = result.activities[i];
      const score = currentScaleAnswers[i * 2 + 1] || 0;
      content += 
        '<div class="field-row">' +
          '<div class="field-label">' + activity + '</div>' +
          '<div class="field-value">' + score + ' 分</div>' +
        '</div>';
    }
    content += '</div>';
  }
  
  if (scale.type === 'choice' && scale.questions) {
    content += 
      '<div class="result-detail-section">' +
        '<div class="result-detail-title">' + icon('list', 18) + '答题详情</div>';
    for (let i = 0; i < scale.questions.length; i++) {
      const q = scale.questions[i];
      let ansIdx = currentScaleChoiceIdx[i];
      if (ansIdx === null || ansIdx === undefined) {
        ansIdx = q.scores.indexOf(currentScaleAnswers[i]);
      }
      const ansText = (ansIdx !== null && ansIdx >= 0) ? q.options[ansIdx] : '未作答';
      content += 
        '<div class="field-row">' +
          '<div class="field-label">第' + (i + 1) + '题</div>' +
          '<div class="field-value">' + ansText + '</div>' +
        '</div>';
    }
    content += '</div>';
  }
  
  content += 
    '<div class="info-banner">' +
      icon('warning', 16) + ' 评估结果仅供参考，不作为诊断依据。如有疑问请咨询专业医生。' +
    '</div>';
  
  const footer = 
    '<button class="btn btn-outline" onclick="showScaleQuestion(0)">' +
      icon('edit', 16) + '重新填写' +
    '</button>' +
    '<button class="btn btn-primary" onclick="saveAssessment()">' +
      icon('save', 16) + '保存记录' +
    '</button>';
  
  document.querySelector('#currentModal .modal-title').textContent = '评估结果';
  document.getElementById('modalBody').innerHTML = content;
  document.querySelector('#currentModal .modal-footer').innerHTML = footer;
}

var __saveAssessmentLock = false;
function saveAssessment() {
  if (__saveAssessmentLock) return;
  __saveAssessmentLock = true;
  try {
    const scale = currentScale;
    let result;

    if (scale.customQuestions) {
      const scores = [];
      const activities = [];
      for (let i = 0; i < (scale.questionCount || 3); i++) {
        activities.push(currentScaleAnswers[i * 2] || ('活动' + (i + 1)));
        scores.push(currentScaleAnswers[i * 2 + 1] || 0);
      }
      result = scale.calculate(scores, activities);
      result.activities = activities;
    } else {
      result = scale.calculate(currentScaleAnswers);
    }

    const record = {
      id: Date.now(),
      scaleId: scale.id,
      scaleName: scale.name,
      shortName: scale.shortName,
      category: scale.category,
      score: result.score,
      maxScore: result.maxScore,
      answers: [...currentScaleAnswers],
      activities: result.activities || null,
      date: new Date().toISOString(),
      patientId: currentPatientId || null
    };

    const history = safeGetJSON('assessmentHistory');
    history.unshift(record);
    if (!safeSetJSON('assessmentHistory', history)) return;

    // 更新实时操作栏
    rtSession.assessments++;
    __rtAssessedIds.add(currentScale.id); // 去重：不同量表数
    rtSetAction('完成评定: ' + currentScale.name);
    updateSessionStats();

    closeModal();
    alert('评估记录已保存！');

    if (currentAssessmentTab === 'history') {
      renderScaleHistory();
    }
  } finally {
    __saveAssessmentLock = false;
  }
}

function renderScaleHistory() {
  const container = document.getElementById('scaleListContainer');
  const history = safeGetJSON('assessmentHistory');
  const patients = safeGetJSON('patients');

  let html =
    '<div class="page-head">' +
      '<div class="page-head-title">' + icon('calendar', 24) + '评分历史</div>' +
      '<div class="page-head-sub">共 <span class="page-head-count">' + history.length + '</span> 条评分记录 · 数据存储在本设备浏览器本地，不会上传</div>' +
    '</div>';

  if (history.length === 0) {
    html +=
      '<div class="empty-state">' +
        icon('calendar', 48) +
        '<div class="empty-state-text">暂无评分记录</div>' +
        '<div class="empty-state-hint">完成任意量表评分后，记录会自动出现在这里</div>' +
        '<button class="btn btn-primary" style="margin-top:16px;" onclick="switchAssessmentTab(\'list\')">' +
          icon('plus', 16) + '去评分' +
        '</button>' +
      '</div>';
    container.innerHTML = html;
    return;
  }

  const ranges = [
    { key: 'all', label: '全部' },
    { key: '7d', label: '最近7天' },
    { key: '30d', label: '最近30天' },
    { key: '90d', label: '最近90天' }
  ];
  html += '<div class="time-filter-bar">';
  ranges.forEach(r => {
    html += '<div class="time-filter-tag ' + (historyTimeRange === r.key ? 'active' : '') + '" onclick="setHistoryTimeRange(\'' + r.key + '\')">' + r.label + '</div>';
  });
  html += '</div>';

  let filtered = history;
  if (historyTimeRange !== 'all') {
    const days = historyTimeRange === '7d' ? 7 : (historyTimeRange === '30d' ? 30 : 90);
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    cutoff.setHours(0, 0, 0, 0);
    filtered = history.filter(r => new Date(r.date) >= cutoff);
  }

  if (filtered.length === 0) {
    html +=
      '<div class="empty-state">' +
        icon('calendar', 48) +
        '<div class="empty-state-text">该时段暂无评分记录</div>' +
        '<div class="empty-state-hint">试试切换其他时间范围，或去做新的评估</div>' +
      '</div>';
    container.innerHTML = html;
    return;
  }

  filtered.forEach(record => {
    const scale = assessmentScales.find(s => s.id === record.scaleId);
    const interp = scale ? getInterpretation(record.score, record.maxScore, scale.interpretation) : null;
    const rawColor = interp ? interp.color : 'other';
    const textColor = rawColor === 'other' ? 'primary' : rawColor;
    const statusClass = rawColor === 'success' ? 'good' : (rawColor === 'warning' ? 'warning' : (rawColor === 'danger' ? 'danger' : 'other'));
    const patient = record.patientId ? patients.find(p => p.id === record.patientId) : null;

    html +=
      '<div class="history-card ' + statusClass + '" onclick="viewHistoryDetail(' + record.id + ')">' +
        '<div class="history-card-top">' +
          '<div class="history-card-name">' + escapeHtml(record.scaleName) + '</div>' +
          (interp ? '<span class="status-tag status-' + statusClass + '">' + escapeHtml(interp.level) + '</span>' : '') +
        '</div>' +
        '<div class="history-card-body">' +
          '<span class="history-card-score text-' + textColor + '">' + record.score + '</span>' +
          '<span class="history-card-max">/ ' + record.maxScore + ' 分</span>' +
        '</div>' +
        '<div class="history-card-meta">' +
          '<span class="history-card-meta-item">' + icon('calendar', 14) + formatDate(record.date) + '</span>' +
          (patient ? '<span class="history-card-patient">' + icon('patient', 12) + escapeHtml(patient.name || '未知患者') + '</span>' : '') +
        '</div>' +
      '</div>';
  });

  container.innerHTML = html;
}

function setHistoryTimeRange(range) {
  historyTimeRange = range;
  renderScaleHistory();
}

function viewHistoryDetail(recordId) {
  const history = safeGetJSON('assessmentHistory');
  const record = history.find(r => r.id === recordId);
  if (!record) return;
  
  const scale = assessmentScales.find(s => s.id === record.scaleId);
  if (!scale) return;
  
  currentScale = scale;
  currentScaleAnswers = [...record.answers];
  currentScaleChoiceIdx = [];
  if (scale.type === 'choice' && scale.questions) {
    for (let i = 0; i < scale.questions.length; i++) {
      const idx = scale.questions[i].scores.indexOf(record.answers[i]);
      currentScaleChoiceIdx.push(idx);
    }
  }
  
  let result;
  if (scale.customQuestions) {
    const scores = [];
    for (let i = 0; i < (scale.questionCount || 3); i++) {
      scores.push(record.answers[i * 2 + 1] || 0);
    }
    result = scale.calculate(scores, record.activities);
    result.activities = record.activities;
  } else {
    result = scale.calculate(record.answers);
  }
  
  const interp = getInterpretation(result.score, result.maxScore, scale.interpretation);
  
  let content = 
    '<div class="result-card">' +
      '<div class="result-score">' + result.score + ' <small>/ ' + result.maxScore + ' 分</small></div>' +
      '<div class="result-level ' + interp.color + '">' + interp.level + '</div>' +
      '<div class="result-desc">' + interp.desc + '</div>' +
      '<div style="font-size:12px;color:var(--text-3);margin-top:12px;">评估时间：' + formatDate(record.date) + '</div>' +
    '</div>';
  
  if (result.activities) {
    content += 
      '<div class="result-detail-section">' +
        '<div class="result-detail-title">' + icon('list', 18) + '各活动评分</div>';
    for (let i = 0; i < result.activities.length; i++) {
      content += 
        '<div class="field-row">' +
          '<div class="field-label">' + result.activities[i] + '</div>' +
          '<div class="field-value">' + (record.answers[i * 2 + 1] || 0) + ' 分</div>' +
        '</div>';
    }
    content += '</div>';
  }
  
  if (scale.type === 'choice' && scale.questions) {
    content += 
      '<div class="result-detail-section">' +
        '<div class="result-detail-title">' + icon('list', 18) + '答题详情</div>';
    for (let i = 0; i < scale.questions.length; i++) {
      const q = scale.questions[i];
      const ansIdx = q.scores.indexOf(record.answers[i]);
      const ansText = ansIdx >= 0 ? q.options[ansIdx] : '未作答';
      content += 
        '<div class="field-row">' +
          '<div class="field-label">第' + (i + 1) + '题</div>' +
          '<div class="field-value">' + ansText + '</div>' +
        '</div>';
    }
    content += '</div>';
  }
  
  const footer = 
    '<button class="btn btn-outline" onclick="deleteHistory(' + record.id + ')">' +
      icon('trash', 16) + '删除' +
    '</button>' +
    '<button class="btn btn-primary" onclick="showExportOptions(' + record.id + ')">' +
      icon('download', 16) + '导出结果' +
    '</button>';
  
  showModal('评估详情', content, footer);
}

var __deleteHistoryLock = false;
function deleteHistory(recordId) {
  if (__deleteHistoryLock) return;
  if (!confirm('确定要删除这条评估记录吗？')) return;
  __deleteHistoryLock = true;
  try {
    let history = safeGetJSON('assessmentHistory');
    history = history.filter(r => r.id !== recordId);
    if (!safeSetJSON('assessmentHistory', history)) return;

    closeModal();
    renderScaleHistory();
  } finally {
    __deleteHistoryLock = false;
  }
}

function switchAssessmentTab(tab) {
  currentAssessmentTab = tab;
  
  const btnScaleList = document.getElementById('btnScaleList');
  const btnScaleHistory = document.getElementById('btnScaleHistory');
  const btnScaleChart = document.getElementById('btnScaleChart');
  
  if (btnScaleList) btnScaleList.classList.toggle('active', tab === 'list');
  if (btnScaleHistory) btnScaleHistory.classList.toggle('active', tab === 'history');
  if (btnScaleChart) btnScaleChart.classList.toggle('active', tab === 'chart');
  
  renderScaleList();
}

function renderScaleChart() {
  const container = document.getElementById('scaleListContainer');
  const history = safeGetJSON('assessmentHistory');

  const scaleMap = {};
  history.forEach(r => {
    if (!scaleMap[r.scaleId]) {
      scaleMap[r.scaleId] = { id: r.scaleId, name: r.scaleName, shortName: r.shortName, color: getRandomColor(Object.keys(scaleMap).length), records: [] };
    }
    scaleMap[r.scaleId].records.push(r);
  });

  Object.keys(scaleMap).forEach(id => {
    scaleMap[id].records.sort((a, b) => new Date(a.date) - new Date(b.date));
  });

  const trendableIds = Object.keys(scaleMap).filter(id => scaleMap[id].records.length >= 2);

  let html =
    '<div class="chart-head">' +
      '<div class="chart-head-title">' + icon('chart', 22) + '评分趋势</div>' +
      '<div class="chart-head-sub">查看同一量表多次评分的分数变化趋势</div>' +
    '</div>';

  if (trendableIds.length === 0) {
    html +=
      '<div class="empty-state">' +
        icon('chart', 48) +
        '<div class="empty-state-text">暂无评分数据</div>' +
        '<div class="empty-state-hint">完成至少 2 次同一量表评分后，可在此查看趋势图</div>' +
        '<button class="btn btn-primary" style="margin-top:16px;" onclick="switchAssessmentTab(\'list\')">' +
          icon('plus', 16) + '去评分' +
        '</button>' +
      '</div>';
    container.innerHTML = html;
    return;
  }

  if (!chartSelectedScale || !scaleMap[chartSelectedScale] || scaleMap[chartSelectedScale].records.length < 2) {
    chartSelectedScale = trendableIds[0];
  }
  // 单量表视图：确保选中量表可见（不再使用图例隐藏）
  chartHiddenScales[chartSelectedScale] = false;

  html += '<div class="scale-selector">';
  trendableIds.forEach(id => {
    const s = scaleMap[id];
    html += '<div class="scale-selector-tag ' + (id === chartSelectedScale ? 'active' : '') + '" onclick="selectChartScale(\'' + id + '\')">' +
      '<span class="dot" style="background:' + s.color + ';"></span>' +
      s.shortName +
      ' <span style="opacity:0.7;">(' + s.records.length + ')</span>' +
    '</div>';
  });
  html += '</div>';

  html += '<div class="time-filter">';
  const ranges = [
    { key: 'all', label: '全部' },
    { key: '1m', label: '近1月' },
    { key: '3m', label: '近3月' },
    { key: '6m', label: '近6月' }
  ];
  ranges.forEach(r => {
    html += '<div class="time-filter-item ' + (chartTimeRange === r.key ? 'active' : '') + '" onclick="setChartTimeRange(\'' + r.key + '\')">' + r.label + '</div>';
  });
  html += '</div>';

  html +=
    '<div class="chart-container">' +
      '<canvas id="trendChart" class="chart-canvas"></canvas>' +
    '</div>';

  const sel = scaleMap[chartSelectedScale];
  const filteredRecords = filterByTimeRange(sel.records, chartTimeRange);

  html += '<div class="improve-rate">' +
    '<div class="improve-rate-title">' + icon('chart', 16) + '改善百分比</div>';

  if (filteredRecords.length >= 2) {
    const first = filteredRecords[0];
    const latest = filteredRecords[filteredRecords.length - 1];
    let rateValue, rateClass, rateArrow, rateText;
    if (first.score === 0) {
      rateValue = '+' + latest.score;
      rateClass = latest.score > 0 ? 'up' : 'flat';
      rateArrow = latest.score > 0 ? '↑' : '—';
      rateText = '最新分数较首次评估新增 ' + latest.score + ' 分';
    } else {
      const pct = ((latest.score - first.score) / first.score) * 100;
      const sign = pct >= 0 ? '+' : '';
      rateValue = sign + pct.toFixed(1) + '%';
      rateClass = pct > 0 ? 'up' : (pct < 0 ? 'down' : 'flat');
      rateArrow = pct > 0 ? '↑' : (pct < 0 ? '↓' : '—');
      rateText = '最新分数较首次评估' + (pct > 0 ? '上升' : (pct < 0 ? '下降' : '持平'));
    }
    html +=
      '<div class="improve-rate-value ' + rateClass + '"><span class="arrow">' + rateArrow + '</span>' + rateValue + '</div>' +
      '<div class="improve-rate-desc">' + rateText + '（' + formatDate(first.date) + ' → ' + formatDate(latest.date) + '）</div>' +
      '<div class="improve-rate-compare">' +
        '<div class="improve-rate-compare-item"><div class="label">首次评分</div><div class="value">' + first.score + ' / ' + first.maxScore + '</div></div>' +
        '<div class="improve-rate-compare-item"><div class="label">最新评分</div><div class="value">' + latest.score + ' / ' + latest.maxScore + '</div></div>' +
        '<div class="improve-rate-compare-item"><div class="label">评估次数</div><div class="value">' + filteredRecords.length + ' 次</div></div>' +
      '</div>';
  } else {
    html += '<div class="improve-rate-desc">当前时间范围内仅有 ' + filteredRecords.length + ' 次评分，至少需要 2 次才能计算变化趋势，可切换时间范围查看</div>';
  }

  html += '</div>';

  container.innerHTML = html;

  const singleMap = {};
  singleMap[chartSelectedScale] = sel;
  setTimeout(() => drawTrendChart(singleMap), 50);
}

function selectChartScale(scaleId) {
  chartSelectedScale = scaleId;
  renderScaleChart();
}

function getRandomColor(index) {
  const colors = ['#2563eb', 'var(--accent-teal)', 'var(--accent-amber)', 'var(--status-error-default)', 'var(--accent-violet)', 'var(--accent-magenta)', 'var(--accent-cyan)', '#84cc16'];
  return colors[index % colors.length];
}

function setChartTimeRange(range) {
  chartTimeRange = range;
  renderScaleChart();
}

function toggleChartScale(scaleId) {
  chartHiddenScales[scaleId] = !chartHiddenScales[scaleId];
  renderScaleChart();
}

function filterByTimeRange(records, range) {
  if (range === 'all') return records;
  
  const now = new Date();
  let months = 1;
  if (range === '3m') months = 3;
  if (range === '6m') months = 6;
  
  const cutoff = new Date(now.getFullYear(), now.getMonth() - months, now.getDate());
  return records.filter(r => new Date(r.date) >= cutoff);
}

function drawTrendChart(scaleMap) {
  const canvas = document.getElementById('trendChart');
  if (!canvas) return;
  
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  
  const w = rect.width;
  const h = rect.height;
  const padding = { top: 20, right: 20, bottom: 30, left: 40 };
  const chartW = w - padding.left - padding.right;
  const chartH = h - padding.top - padding.bottom;
  
  let allDates = [];
  let maxScore = 0;
  let minScore = Infinity;
  
  Object.keys(scaleMap).forEach(id => {
    if (chartHiddenScales[id]) return;
    const records = filterByTimeRange(scaleMap[id].records, chartTimeRange);
    records.forEach(r => {
      allDates.push(new Date(r.date));
      maxScore = Math.max(maxScore, r.maxScore);
      minScore = Math.min(minScore, 0);
    });
  });
  
  if (allDates.length === 0) {
    ctx.fillStyle = '#9ca3af';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('暂无数据', w / 2, h / 2);
    return;
  }
  
  allDates.sort((a, b) => a - b);
  const minDate = allDates[0];
  const maxDate = allDates[allDates.length - 1];
  const dateRange = maxDate - minDate || 1;
  
  ctx.strokeStyle = '#e5e7eb';
  ctx.lineWidth = 1;
  
  const ySteps = 5;
  for (let i = 0; i <= ySteps; i++) {
    const y = padding.top + (chartH / ySteps) * i;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(w - padding.right, y);
    ctx.stroke();
    
    const score = maxScore - (maxScore - minScore) * (i / ySteps);
    ctx.fillStyle = '#9ca3af';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(Math.round(score), padding.left - 6, y + 4);
  }
  
  if (allDates.length >= 2) {
    const xSteps = Math.min(5, allDates.length);
    for (let i = 0; i <= xSteps; i++) {
      const ratio = i / xSteps;
      const x = padding.left + chartW * ratio;
      const date = new Date(minDate.getTime() + dateRange * ratio);
      ctx.fillStyle = '#9ca3af';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(formatDateShort(date), x, h - padding.bottom + 16);
    }
  }
  
  Object.keys(scaleMap).forEach(id => {
    if (chartHiddenScales[id]) return;
    const s = scaleMap[id];
    const records = filterByTimeRange(s.records, chartTimeRange);
    if (records.length === 0) return;
    
    ctx.strokeStyle = s.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    records.forEach((r, i) => {
      const x = padding.left + chartW * ((new Date(r.date) - minDate) / dateRange);
      const y = padding.top + chartH * (1 - (r.score - minScore) / (maxScore - minScore));
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.stroke();
    
    records.forEach(r => {
      const x = padding.left + chartW * ((new Date(r.date) - minDate) / dateRange);
      const y = padding.top + chartH * (1 - (r.score - minScore) / (maxScore - minScore));
      
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.strokeStyle = s.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.stroke();
    });
  });
}

function showExportOptions(recordId) {
  const history = safeGetJSON('assessmentHistory');
  const record = history.find(r => r.id === recordId);
  if (!record) return;
  
  const content = 
    '<div class="export-options">' +
      '<div class="export-option" onclick="exportAsText(' + recordId + ')">' +
        icon('copy', 32) +
        '<div class="export-option-name">文本格式</div>' +
        '<div class="export-option-desc">复制到剪贴板</div>' +
      '</div>' +
      '<div class="export-option" onclick="exportAsImage(' + recordId + ')">' +
        icon('download', 32) +
        '<div class="export-option-name">图片格式</div>' +
        '<div class="export-option-desc">白底简洁版</div>' +
      '</div>' +
    '</div>' +
    '<div class="info-banner">' +
      icon('warning', 16) + ' 评估结果仅供参考，不作为诊断依据。' +
    '</div>';
  
  const footer = 
    '<button class="btn btn-outline btn-block" onclick="viewHistoryDetail(' + recordId + ')">' +
      icon('back', 16) + '返回详情' +
    '</button>';
  
  document.querySelector('#currentModal .modal-title').textContent = '导出评估结果';
  document.getElementById('modalBody').innerHTML = content;
  document.querySelector('#currentModal .modal-footer').innerHTML = footer;
}

function exportAsText(recordId) {
  const history = safeGetJSON('assessmentHistory');
  const record = history.find(r => r.id === recordId);
  if (!record) return;
  
  const scale = assessmentScales.find(s => s.id === record.scaleId);
  const interp = scale ? getInterpretation(record.score, record.maxScore, scale.interpretation) : null;
  
  let text = 
    '【' + record.scaleName + '】\n' +
    '评估时间：' + formatDate(record.date) + '\n' +
    '评估得分：' + record.score + ' / ' + record.maxScore + ' 分\n';
  
  if (interp) {
    text += '结果等级：' + interp.level + '\n';
    text += '结果解读：' + interp.desc + '\n';
  }
  
  text += '\n--- 答题详情 ---\n';
  
  if (scale && scale.type === 'choice' && scale.questions) {
    for (let i = 0; i < scale.questions.length; i++) {
      const q = scale.questions[i];
      const ansIdx = q.scores.indexOf(record.answers[i]);
      const ansText = ansIdx >= 0 ? q.options[ansIdx] : '未作答';
      text += (i + 1) + '. ' + q.text + '\n   答案：' + ansText + '\n';
    }
  }
  
  text += '\n--- 评估结果仅供参考，不作为诊断依据 ---';
  
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      alert('已复制到剪贴板！');
    }).catch(() => {
      fallbackCopy(text);
    });
  } else {
    fallbackCopy(text);
  }
}

function fallbackCopy(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand('copy');
    alert('已复制到剪贴板！');
  } catch (e) {
    alert('复制失败，请手动复制');
  }
  document.body.removeChild(textarea);
}

function exportAsImage(recordId) {
  const history = safeGetJSON('assessmentHistory');
  const record = history.find(r => r.id === recordId);
  if (!record) return;
  
  const scale = assessmentScales.find(s => s.id === record.scaleId);
  const interp = scale ? getInterpretation(record.score, record.maxScore, scale.interpretation) : null;
  
  const canvas = document.createElement('canvas');
  const w = 600;
  const h = 800;
  canvas.width = w;
  canvas.height = h;
  
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, w, h);
  
  ctx.fillStyle = '#2563eb';
  ctx.fillRect(0, 0, w, 120);
  
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 28px -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(record.scaleName, w / 2, 55);
  
  ctx.font = '16px -apple-system, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.fillText('评估时间：' + formatDate(record.date), w / 2, 85);
  
  ctx.fillStyle = '#111827';
  ctx.font = 'bold 72px -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(record.score, w / 2, 220);
  
  ctx.font = '20px -apple-system, sans-serif';
  ctx.fillStyle = '#6b7280';
  ctx.fillText('/ ' + record.maxScore + ' 分', w / 2, 250);
  
  if (interp) {
    const colors = {
      success: 'var(--accent-teal)',
      warning: 'var(--accent-amber)',
      danger: 'var(--status-error-default)'
    };
    const color = colors[interp.color] || '#2563eb';
    
    ctx.fillStyle = color;
    ctx.font = 'bold 24px -apple-system, sans-serif';
    ctx.fillText(interp.level, w / 2, 310);
    
    ctx.fillStyle = '#4b5563';
    ctx.font = '16px -apple-system, sans-serif';
    ctx.textAlign = 'center';
    
    const words = interp.desc.split('');
    let line = '';
    let y = 350;
    const maxWidth = w - 80;
    
    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i];
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && i > 0) {
        ctx.fillText(line, w / 2, y);
        line = words[i];
        y += 28;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, w / 2, y);
  }
  
  ctx.strokeStyle = '#e5e7eb';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(40, 420);
  ctx.lineTo(w - 40, 420);
  ctx.stroke();
  
  ctx.fillStyle = '#111827';
  ctx.font = 'bold 18px -apple-system, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('答题详情', 40, 460);
  
  ctx.font = '14px -apple-system, sans-serif';
  ctx.fillStyle = '#4b5563';
  
  let yPos = 495;
  if (scale && scale.type === 'choice' && scale.questions) {
    for (let i = 0; i < Math.min(scale.questions.length, 10); i++) {
      const q = scale.questions[i];
      const ansIdx = q.scores.indexOf(record.answers[i]);
      const ansText = ansIdx >= 0 ? q.options[ansIdx] : '未作答';
      
      ctx.fillStyle = '#111827';
      ctx.fillText((i + 1) + '. ' + q.text, 40, yPos);
      yPos += 24;
      ctx.fillStyle = '#6b7280';
      ctx.fillText('   答案：' + ansText, 40, yPos);
      yPos += 28;
      
      if (yPos > h - 100) {
        ctx.fillStyle = '#9ca3af';
        ctx.fillText('... 更多详情请在App内查看', 40, yPos + 10);
        break;
      }
    }
  }
  
  ctx.fillStyle = '#9ca3af';
  ctx.font = '12px -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('本评估结果仅供参考，不作为诊断依据', w / 2, h - 30);
  
  const dataUrl = canvas.toDataURL('image/png');
  
  const link = document.createElement('a');
  link.download = record.scaleName + '_' + formatDate(record.date).replace(/[:\s]/g, '_') + '.png';
  link.href = dataUrl;
  link.click();
  
  alert('图片已生成，正在下载...\n（如未自动下载，请长按图片保存）');
}

// 挂载 window（onclick 内联调用需要）
global.renderScaleLibrary=renderScaleLibrary;
global.startScale=startScale;
global.hasEvidenceData=hasEvidenceData;
global.renderEvidenceHtml=renderEvidenceHtml;
global.showScaleIntro=showScaleIntro;
global.showScaleQuestion=showScaleQuestion;
global.updateSliderValue=updateSliderValue;
global.updatePsfsScore=updatePsfsScore;
global.selectOption=selectOption;
global.toggleYesNo=toggleYesNo;
global.submitScale=submitScale;
global.showScaleResult=showScaleResult;
global.saveAssessment=saveAssessment;
global.renderScaleHistory=renderScaleHistory;
global.setHistoryTimeRange=setHistoryTimeRange;
global.viewHistoryDetail=viewHistoryDetail;
global.deleteHistory=deleteHistory;
global.switchAssessmentTab=switchAssessmentTab;
global.renderScaleChart=renderScaleChart;
global.selectChartScale=selectChartScale;
global.getRandomColor=getRandomColor;
global.setChartTimeRange=setChartTimeRange;
global.toggleChartScale=toggleChartScale;
global.filterByTimeRange=filterByTimeRange;
global.drawTrendChart=drawTrendChart;
global.showExportOptions=showExportOptions;
global.exportAsText=exportAsText;
global.fallbackCopy=fallbackCopy;
global.exportAsImage=exportAsImage;
})(typeof window!=='undefined'?window:this);
