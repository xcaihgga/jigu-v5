/**
 * ═══════════════════════════════════════════════════════════════
 *  肌肉查询 + 疾病查询模块
 *  包含：身体区域网格、列表、详情页、搜索筛选、相关推荐、解剖插图
 * ═══════════════════════════════════════════════════════════════
 *
 *  使用方式：
 *    <script src="src/muscle-disease.js"></script>
 *    在 init() 中调用 renderMuscleBodyGrid() / renderDiseaseBodyGrid()
 *
 *  依赖（全局）：
 *    - utils.js:  icon, escapeHtml, formatContent
 *    - router.js: showPage
 *    - data.js:   muscles, diseases, muscleBodyParts, diseaseBodyParts
 */

(function (global) {
  'use strict';

  // ═══════════════════════════════════════════════════
  //  1. 区域映射
  // ═══════════════════════════════════════════════════

  var muscleRegionMap = {
    '头颈部': { id: 'neck', icon: 'head' },
    '肩部': { id: 'upperarm', icon: 'shoulder' },
    '上肢': { id: 'upperarm', icon: 'arm' },
    '背部': { id: 'back', icon: 'backBody' },
    '背部深层': { id: 'back', icon: 'backBody' },
    '胸部': { id: 'trunk', icon: 'chest' },
    '腹部': { id: 'trunk', icon: 'chest' },
    '胸壁': { id: 'trunk', icon: 'chest' },
    '膈肌': { id: 'trunk', icon: 'chest' },
    '前臂': { id: 'forearm', icon: 'hand' },
    '手部': { id: 'forearm', icon: 'hand' },
    '腰臀部': { id: 'pelvis', icon: 'pelvis' },
    '骨盆': { id: 'pelvis', icon: 'pelvis' },
    '腰/臀/骨盆': { id: 'pelvis', icon: 'pelvis' },
    '臀部': { id: 'pelvis', icon: 'pelvis' },
    '盆底': { id: 'pelvis', icon: 'pelvis' },
    '大腿': { id: 'thigh', icon: 'thigh' },
    '膝部': { id: 'thigh', icon: 'knee' },
    '小腿': { id: 'lowerleg', icon: 'foot' },
    '足部': { id: 'lowerleg', icon: 'foot' },
    '髋部': { id: 'pelvis', icon: 'hip' },
  };

  function getMuscleRegion(regionName) {
    return muscleRegionMap[regionName] || { id: 'trunk', icon: 'chest' };
  }

  var diseaseRegionMap = {
    '颈椎': { id: 'cervical', icon: 'cervical' },
    '胸椎': { id: 'thoracic', icon: 'thoracic' },
    '腰椎': { id: 'lumbar', icon: 'lumbar' },
    '肩关节': { id: 'shoulder', icon: 'shoulder-joint' },
    '肘关节': { id: 'elbow', icon: 'elbow' },
    '腕关节': { id: 'wrist', icon: 'wrist' },
    '骨盆': { id: 'pelvis2', icon: 'pelvis-joint' },
    '髋关节': { id: 'hip', icon: 'hip' },
    '膝关节': { id: 'knee', icon: 'knee' },
    '脚踝': { id: 'ankle', icon: 'ankle' },
  };

  function getDiseaseRegion(regionName) {
    return diseaseRegionMap[regionName] || { id: 'lumbar', icon: 'lumbar' };
  }

  // ═══════════════════════════════════════════════════
  //  2. 解剖插图映射
  // ═══════════════════════════════════════════════════

  // 解剖插图映射：肌肉身体区域 id / 疾病部位 id -> 解剖图文件名
  var illustrationMap = {
    // 肌肉区域
    neck: 'anatomy-neck-muscles',
    upperarm: 'anatomy-shoulder-arm',
    back: 'anatomy-superficial-muscles-back',
    trunk: 'anatomy-chest-abdomen',
    forearm: 'anatomy-hand-wrist',
    pelvis: 'anatomy-pelvic-floor',
    thigh: 'anatomy-leg-muscles',
    lowerleg: 'anatomy-foot',
    // 疾病部位
    cervical: 'anatomy-neck-head',
    thoracic: 'anatomy-thorax-ribs',
    lumbar: 'anatomy-spine-torso',
    shoulder: 'anatomy-deep-muscles-shoulder',
    elbow: 'anatomy-arm-muscles',
    wrist: 'anatomy-hand-wrist',
    pelvis2: 'anatomy-gluteal-region',
    hip: 'anatomy-hip-leg',
    knee: 'anatomy-knee-ankle',
    ankle: 'anatomy-foot',
  };

  // 疾病名称关键字 -> 康复/运动类插图
  var keywordIllustrationMap = [
    { kw: ['触发点', '激痛点'], img: 'anatomy-trigger-points' },
    { kw: ['筋膜'], img: 'anatomy-fascia-meridian' },
    { kw: ['肌腱', '腱'], img: 'anatomy-tendons-ligaments' },
    { kw: ['关节'], img: 'anatomy-joints-system' },
    { kw: ['本体感觉', '平衡'], img: 'anatomy-proprioception-pathway' },
    { kw: ['姿势', '体态'], img: 'anatomy-postural-control' },
    { kw: ['前庭'], img: 'anatomy-vestibular-system' },
    { kw: ['淋巴'], img: 'anatomy-lymphatic-system' },
  ];

  function getIllustration(regionId, diseaseName) {
    if (diseaseName) {
      for (var i = 0; i < keywordIllustrationMap.length; i++) {
        var k = keywordIllustrationMap[i];
        for (var j = 0; j < k.kw.length; j++) {
          if (diseaseName.indexOf(k.kw[j]) >= 0) return k.img;
        }
      }
    }
    return illustrationMap[regionId] || 'atlas-reference';
  }

  function illustrationHtml(imgName, alt) {
    if (!imgName) return '';
    return '<div class="detail-illustration">' +
      '<img src="assets/illustrations/' + imgName + '.webp" alt="' + (alt || '') + '" loading="lazy" ' +
      'onerror="this.parentNode.style.display=\'none\'">' +
      '<div class="detail-illustration-caption">解剖参考图</div>' +
    '</div>';
  }

  // ═══════════════════════════════════════════════════
  //  3. 详情页分区配置
  // ═══════════════════════════════════════════════════

  var muscleDetailSections = [
    { key: 'redflag', title: '红旗征/紧急预警', icon: 'warning', fields: ['红旗征/紧急预警'] },
    { key: 'basics', title: '基础解剖与功能', icon: 'basics', fields: ['序号', '身体区域', '肌肉名称', '主要功能', '常见损伤', '评估方法', '激痛点'] },
    { key: 'symptoms', title: '症状与诊断', icon: 'symptoms', fields: ['诊断标准', '典型症状与体征', '影像学特征', '鉴别诊断', '常用评估量表', '分期/严重度分级'] },
    { key: 'treatment', title: '治疗方案', icon: 'treatment', fields: ['急性期处理', '治疗方案', '手术指征', '药物治疗', '注射治疗', '治疗禁忌', '辅助康复', '再生医学与新技术'] },
    { key: 'rehab', title: '康复训练', icon: 'rehab', fields: ['康复训练', '康复训练方案', '康复禁忌动作'] },
    { key: 'prognosis', title: '预后与预防', icon: 'prognosis', fields: ['预后转归', '常见并发症', '生活方式调整', '预防措施', '心理与行为干预', '辅助器具推荐', '重返标准', '重返运动/工作评估'] },
    { key: 'evidence', title: '循证与参考', icon: 'evidence', fields: ['循证等级', '证据等级(GRADE)', '最新循证进展', '患者教育与避坑指南', '共病适配方案', '运动风险与代偿评估', '特殊人群适配', 'ICD-10编码', '关联骨科疾病', '疾病分类', '疾病分级'] },
  ];

  var diseaseDetailSections = [
    { key: 'redflag', title: '红旗征/紧急预警', icon: 'warning', fields: ['红旗征/紧急预警'] },
    { key: 'symptoms', title: '症状与诊断', icon: 'symptoms', fields: ['具体病症', '部位', '疾病分类', '疾病分级', 'ICD-10编码', '典型症状与体征', '影像学特征', '鉴别诊断', '常用评估量表', '分期/严重度分级'] },
    { key: 'treatment', title: '治疗方案', icon: 'treatment', fields: ['治疗方案', '手术指征', '药物治疗', '注射治疗', '辅助康复', '再生医学与新技术', '特殊人群适配'] },
    { key: 'rehab', title: '康复训练', icon: 'rehab', fields: ['康复训练方案', '康复禁忌动作'] },
    { key: 'prognosis', title: '预后与预防', icon: 'prognosis', fields: ['预后转归', '常见并发症', '生活方式调整', '心理与行为干预', '辅助器具推荐', '预防措施', '重返运动/工作评估', '共病适配方案', '运动风险与代偿评估'] },
    { key: 'evidence', title: '循证与参考', icon: 'evidence', fields: ['证据等级(GRADE)', '最新循证进展', '患者教育与避坑指南'] },
  ];

  // ═══════════════════════════════════════════════════
  //  4. 肌肉：身体区域网格 / 列表 / 详情
  // ═══════════════════════════════════════════════════

  function renderMuscleBodyGrid() {
    var grid = document.getElementById('muscleBodyGrid');
    if (!grid) return;
    // data.js 后台加载未完成时 muscleBodyParts 未定义，兜底避免 ReferenceError
    if (typeof muscleBodyParts === 'undefined' || !Array.isArray(muscleBodyParts)) {
      console.warn('[Muscle] muscleBodyParts 未就绪，跳过肌肉网格渲染');
      return;
    }
    var counts = {};
    muscleBodyParts.forEach(function (p) { counts[p.id] = 0; });
    var muscleData = typeof muscles !== 'undefined' ? muscles : [];
    muscleData.forEach(function (m) {
      var region = getMuscleRegion(m['身体区域']);
      counts[region.id] = (counts[region.id] || 0) + 1;
    });

    grid.innerHTML = muscleBodyParts.map(function (part) {
      return '<div class="body-card" data-part="' + part.id + '" onclick="showMuscleList(\'' + part.id + '\', \'' + escapeAttr(part.name) + '\')">' +
        '<div class="icon-wrap">' + icon(part.icon, 22) + '</div>' +
        '<div class="body-card-name">' + escapeHtml(part.name) + '</div>' +
        '<div class="body-card-count">' + (counts[part.id] || 0) + ' 块</div>' +
      '</div>';
    }).join('');
  }

  function showMuscleList(regionId, regionName) {
    var muscleData = typeof muscles !== 'undefined' ? muscles : [];
    var filtered = muscleData.filter(function (m) { return getMuscleRegion(m['身体区域']).id === regionId; });
    var pageId = 'muscle-list-' + regionId;

    var pageEl = document.getElementById('page-' + pageId);
    if (!pageEl) {
      pageEl = document.createElement('div');
      pageEl.className = 'page';
      pageEl.id = 'page-' + pageId;

      var listHtml = '';
      for (var i = 0; i < filtered.length; i++) {
        var m = filtered[i];
        var idx = muscleData.indexOf(m);
        listHtml +=
          '<div class="list-item" onclick="showMuscleDetail(' + idx + ')">' +
            icon(getMuscleRegion(m['身体区域']).icon, 36) +
            '<div class="list-item-content">' +
              '<div class="list-item-title">' + (m['肌肉名称'] || '-') + '</div>' +
              '<div class="list-item-desc">' + (m['主要功能'] || m['常见损伤'] || '-') + '</div>' +
            '</div>' +
            '<div class="list-item-arrow">' + icon('chevronRight', 18) + '</div>' +
          '</div>';
      }

      pageEl.innerHTML =
        '<div class="section-title">' +
          icon('list', 20) +
          regionName + ' (' + filtered.length + '块)' +
        '</div>' +
        '<div>' + listHtml + '</div>';

      document.getElementById('content').appendChild(pageEl);
    }

    showPage(pageId);
    var titleEl = document.getElementById('navTitle');
    if (titleEl) titleEl.textContent = regionName;
  }

  function findRelatedDiseases(muscleName, relatedDiseaseText) {
    var diseaseData = typeof diseases !== 'undefined' ? diseases : [];
    var results = [];
    var muscleKey = muscleName.replace(/肌$/, '').replace(/[肌肉]/g, '');

    for (var i = 0; i < diseaseData.length; i++) {
      var d = diseaseData[i];
      var diseaseName = d['具体病症'] || '';
      if (diseaseName.indexOf(muscleKey) >= 0 || diseaseName.indexOf(muscleName) >= 0) {
        results.push({ index: i, name: diseaseName, part: d['部位'] || '' });
        if (results.length >= 5) break;
      }
    }

    if (results.length === 0 && relatedDiseaseText) {
      var diseaseNames = relatedDiseaseText.split(/[、，,；;]/).map(function (s) { return s.trim(); }).filter(function (s) { return s.length > 1; });
      for (var ni = 0; ni < diseaseNames.length; ni++) {
        var dn = diseaseNames[ni];
        for (var j = 0; j < diseaseData.length; j++) {
          var dj = diseaseData[j];
          if (dj['具体病症'] && (dj['具体病症'].indexOf(dn) >= 0 || dn.indexOf(dj['具体病症'].replace(/症$/, '')) >= 0)) {
            if (!results.find(function (r) { return r.index === j; })) {
              results.push({ index: j, name: dj['具体病症'], part: dj['部位'] || '' });
            }
            break;
          }
        }
        if (results.length >= 5) break;
      }
    }

    return results;
  }

  function showMuscleDetail(index) {
    var muscleData = typeof muscles !== 'undefined' ? muscles : [];
    var m = muscleData[index];
    if (!m) return;

    var pageId = 'muscle-detail-' + index;
    var pageEl = document.getElementById('page-' + pageId);

    if (!pageEl) {
      var hasRedFlag = m['红旗征/紧急预警'] || m['红旗征'];
      var sectionsHtml = '';
      var sectionFieldMap = {};
      for (var si = 0; si < muscleDetailSections.length; si++) {
        var sec = muscleDetailSections[si];
        var fieldsContent = '';
        var fieldList = [];
        for (var fi = 0; fi < sec.fields.length; fi++) {
          var f = sec.fields[fi];
          if (m[f]) {
            fieldsContent += '<div class="field-row" data-field="' + f + '"><div class="field-label">' + f + '</div><div class="field-value">' + formatContent(m[f]) + '</div></div>';
            fieldList.push(f);
          }
        }

        if (!fieldsContent.trim()) continue;

        sectionFieldMap[sec.key] = { title: sec.title, icon: sec.icon, fields: fieldList };

        var fieldPreview = fieldList.length > 0 ? fieldList.slice(0, 4).join(' · ') + (fieldList.length > 4 ? ' 等' : '') : '';

        sectionsHtml +=
          '<div class="accordion-item ' + (si === 0 ? 'open' : '') + '" data-section="' + sec.key + '">' +
            '<div class="accordion-header" onclick="toggleAccordion(this)">' +
              '<div class="accordion-header-top">' +
                icon(sec.icon, 22) +
                '<div class="accordion-title">' + sec.title + '</div>' +
                '<div class="accordion-chevron">' + icon('chevronDown', 20) + '</div>' +
              '</div>' +
              (fieldPreview ? '<div class="accordion-preview">' + fieldPreview + '</div>' : '') +
            '</div>' +
            '<div class="accordion-body">' +
              '<div class="accordion-content">' + fieldsContent + '</div>' +
            '</div>' +
          '</div>';
      }

      var activeSections = muscleDetailSections.filter(function (sec) {
        return sec.fields.some(function (f) { return m[f]; });
      });

      var catalogHtml = '';
      for (var key in sectionFieldMap) {
        var sec2 = sectionFieldMap[key];
        var fieldsHtml = '';
        sec2.fields.forEach(function (f) {
          fieldsHtml += '<div class="catalog-field-item" onclick="jumpToField(\'' + key + '\', \'' + f + '\', \'' + pageId + '\')">' + f + '</div>';
        });
        catalogHtml +=
          '<div class="catalog-section">' +
            '<div class="catalog-section-header" onclick="toggleCatalogSection(this)">' +
              '<span class="icon">' + icon(sec2.icon, 22) + '</span>' +
              '<div class="catalog-section-title">' + sec2.title + '</div>' +
              '<span class="catalog-section-chevron">' + icon('chevronDown', 18) + '</span>' +
            '</div>' +
            '<div class="catalog-section-body">' +
              '<div class="catalog-fields">' + fieldsHtml + '</div>' +
            '</div>' +
          '</div>';
      }

      var relatedDiseases = findRelatedDiseases(m['肌肉名称'] || '', m['关联骨科疾病'] || '');
      var relatedHtml = '';
      if (relatedDiseases.length > 0) {
        relatedHtml += '<div class="divider-section"></div>';
        relatedHtml += '<div class="section-title">' + icon('diagnosis', 20) + '相关疾病</div>';
        relatedDiseases.forEach(function (rd) {
          relatedHtml +=
            '<div class="list-item" onclick="showDiseaseDetail(' + rd.index + ')">' +
              icon(getDiseaseRegion(rd.part).icon, 36) +
              '<div class="list-item-content">' +
                '<div class="list-item-title">' + rd.name + '</div>' +
                '<div class="list-item-desc">' + rd.part + '</div>' +
              '</div>' +
              '<div class="list-item-arrow">' + icon('chevronRight', 18) + '</div>' +
            '</div>';
        });
      }

      pageEl = document.createElement('div');
      pageEl.className = 'page';
      pageEl.id = 'page-' + pageId;

      var tagsHtml = '';
      if (m['循证等级']) tagsHtml += '<span class="detail-tag">循证: ' + m['循证等级'] + '</span>';
      if (m['证据等级(GRADE)']) tagsHtml += '<span class="detail-tag">GRADE: ' + m['证据等级(GRADE)'] + '</span>';
      if (hasRedFlag) tagsHtml += '<span class="detail-tag" style="background:rgba(239,68,68,0.3);cursor:pointer;" onclick="scrollToSection(\'redflag\')">⚠ 红旗征 →</span>';

      var mainFunc = m['主要功能'] ? m['主要功能'].slice(0, 30) : '';

      var catalogPanelId = 'catalog-' + pageId;

      pageEl.innerHTML =
        '<div class="detail-header">' +
          '<div class="detail-header-title">' + (m['肌肉名称'] || '-') + '</div>' +
          '<div class="detail-header-sub">' + (m['身体区域'] || '') + ' · ' + mainFunc + '</div>' +
          '<div class="detail-tags">' + tagsHtml + '</div>' +
        '</div>' +
        illustrationHtml(getIllustration(getMuscleRegion(m['身体区域']).id), m['肌肉名称']) +
        (hasRedFlag ? '<button class="redflag-btn" onclick="scrollToSection(\'redflag\')">' +
          '<span class="icon">' + icon('warning', 20) + '</span>' +
          '红旗征/紧急预警' +
          '<span class="redflag-arrow">' + icon('chevronRight', 18) + '</span>' +
        '</button>' : '') +
        '<button class="catalog-btn" onclick="openCatalog(\'' + catalogPanelId + '\')">' +
          '<span class="icon">' + icon('list', 20) + '</span>' +
          '查看目录' +
          '<span class="catalog-btn-count">' + activeSections.length + ' 个分类</span>' +
        '</button>' +
        '<div class="btn-row">' +
          '<button class="btn btn-outline" onclick="expandAllAccordion()">' +
            icon('expand', 16) +
            '全部展开' +
          '</button>' +
          '<button class="btn btn-outline" onclick="collapseAllAccordion()">' +
            icon('collapse', 16) +
            '全部收起' +
          '</button>' +
        '</div>' +
        sectionsHtml +
        relatedHtml +
        '<div class="catalog-panel" id="' + catalogPanelId + '">' +
          '<div class="catalog-header">' +
            '<button class="catalog-back" onclick="closeCatalog(\'' + catalogPanelId + '\')">' +
              '<span class="icon">' + icon('chevronLeft', 22) + '</span>' +
            '</button>' +
            '<div class="catalog-title">内容目录</div>' +
          '</div>' +
          '<div class="catalog-list">' + catalogHtml + '</div>' +
        '</div>';

      document.getElementById('content').appendChild(pageEl);
    }

    showPage(pageId);
    var titleEl2 = document.getElementById('navTitle');
    if (titleEl2) titleEl2.textContent = m['肌肉名称'] || '肌肉详情';
  }

  // ═══════════════════════════════════════════════════
  //  5. 疾病：身体部位网格 / 列表 / 详情
  // ═══════════════════════════════════════════════════

  function renderDiseaseBodyGrid() {
    var grid = document.getElementById('diseaseBodyGrid');
    if (!grid) return;
    // data.js 后台加载未完成时 diseaseBodyParts 未定义，兜底避免 ReferenceError
    if (typeof diseaseBodyParts === 'undefined' || !Array.isArray(diseaseBodyParts)) {
      console.warn('[Disease] diseaseBodyParts 未就绪，跳过疾病网格渲染');
      return;
    }
    var counts = {};
    diseaseBodyParts.forEach(function (p) { counts[p.id] = 0; });
    var diseaseData = typeof diseases !== 'undefined' ? diseases : [];
    diseaseData.forEach(function (d) {
      var region = getDiseaseRegion(d['部位']);
      counts[region.id] = (counts[region.id] || 0) + 1;
    });

    grid.innerHTML = diseaseBodyParts.map(function (part) {
      return '<div class="body-card" data-part="' + part.id + '" onclick="showDiseaseList(\'' + part.id + '\', \'' + escapeAttr(part.name) + '\')">' +
        '<div class="icon-wrap">' + icon(part.icon, 22) + '</div>' +
        '<div class="body-card-name">' + escapeHtml(part.name) + '</div>' +
        '<div class="body-card-count">' + (counts[part.id] || 0) + ' 种</div>' +
      '</div>';
    }).join('');
  }

  function showDiseaseList(regionId, regionName) {
    var diseaseData = typeof diseases !== 'undefined' ? diseases : [];
    var filtered = diseaseData.filter(function (d) { return getDiseaseRegion(d['部位']).id === regionId; });
    var pageId = 'disease-list-' + regionId;

    var pageEl = document.getElementById('page-' + pageId);
    if (!pageEl) {
      pageEl = document.createElement('div');
      pageEl.className = 'page';
      pageEl.id = 'page-' + pageId;

      var listHtml = '';
      for (var i = 0; i < filtered.length; i++) {
        var d = filtered[i];
        var idx = diseaseData.indexOf(d);
        var desc = (d['疾病分类'] || '') + (d['疾病分级'] ? ' · ' + d['疾病分级'] : '');
        listHtml +=
          '<div class="list-item" onclick="showDiseaseDetail(' + idx + ')">' +
            icon(getDiseaseRegion(d['部位']).icon, 36) +
            '<div class="list-item-content">' +
              '<div class="list-item-title">' + (d['具体病症'] || '-') + '</div>' +
              '<div class="list-item-desc">' + desc + '</div>' +
            '</div>' +
            '<div class="list-item-arrow">' + icon('chevronRight', 18) + '</div>' +
          '</div>';
      }

      pageEl.innerHTML =
        '<div class="section-title">' +
          icon('list', 20) +
          regionName + ' (' + filtered.length + '种)' +
        '</div>' +
        '<div>' + listHtml + '</div>';

      document.getElementById('content').appendChild(pageEl);
    }

    showPage(pageId);
    var titleEl = document.getElementById('navTitle');
    if (titleEl) titleEl.textContent = regionName;
  }

  function findRelatedMuscles(diseaseName, diseasePart) {
    var muscleData = typeof muscles !== 'undefined' ? muscles : [];
    var results = [];
    var diseaseKey = diseaseName.replace(/症$/, '').replace(/炎$/, '').replace(/综合征$/, '');

    for (var i = 0; i < muscleData.length; i++) {
      var m = muscleData[i];
      var muscleName = m['肌肉名称'] || '';
      var region = m['身体区域'] || '';
      var related = m['关联骨科疾病'] || '';

      if (muscleName.indexOf(diseaseKey) >= 0 || diseaseKey.indexOf(muscleName.replace(/肌$/, '')) >= 0) {
        results.push({ index: i, name: muscleName, part: region });
      } else if (related && related.indexOf(diseaseName) >= 0) {
        results.push({ index: i, name: muscleName, part: region });
      }
      if (results.length >= 5) break;
    }

    if (results.length === 0 && diseasePart) {
      for (var j = 0; j < muscleData.length; j++) {
        var mj = muscleData[j];
        var regionJ = mj['身体区域'] || '';
        if (regionJ.indexOf(diseasePart) >= 0 || diseasePart.indexOf(regionJ) >= 0) {
          results.push({ index: j, name: mj['肌肉名称'], part: regionJ });
          if (results.length >= 5) break;
        }
      }
    }

    return results;
  }

  function showDiseaseDetail(index) {
    var diseaseData = typeof diseases !== 'undefined' ? diseases : [];
    var d = diseaseData[index];
    if (!d) return;

    var pageId = 'disease-detail-' + index;
    var pageEl = document.getElementById('page-' + pageId);

    if (!pageEl) {
      var hasRedFlag = d['红旗征/紧急预警'];
      var sectionsHtml = '';
      var sectionFieldMap = {};
      for (var si = 0; si < diseaseDetailSections.length; si++) {
        var sec = diseaseDetailSections[si];
        var fieldsContent = '';
        var fieldList = [];
        for (var fi = 0; fi < sec.fields.length; fi++) {
          var f = sec.fields[fi];
          if (d[f]) {
            fieldsContent += '<div class="field-row" data-field="' + f + '"><div class="field-label">' + f + '</div><div class="field-value">' + formatContent(d[f]) + '</div></div>';
            fieldList.push(f);
          }
        }

        if (!fieldsContent.trim()) continue;

        sectionFieldMap[sec.key] = { title: sec.title, icon: sec.icon, fields: fieldList };

        var fieldPreview = fieldList.length > 0 ? fieldList.slice(0, 4).join(' · ') + (fieldList.length > 4 ? ' 等' : '') : '';

        sectionsHtml +=
          '<div class="accordion-item ' + (si === 0 ? 'open' : '') + '" data-section="' + sec.key + '">' +
            '<div class="accordion-header" onclick="toggleAccordion(this)">' +
              '<div class="accordion-header-top">' +
                icon(sec.icon, 22) +
                '<div class="accordion-title">' + sec.title + '</div>' +
                '<div class="accordion-chevron">' + icon('chevronDown', 20) + '</div>' +
              '</div>' +
              (fieldPreview ? '<div class="accordion-preview">' + fieldPreview + '</div>' : '') +
            '</div>' +
            '<div class="accordion-body">' +
              '<div class="accordion-content">' + fieldsContent + '</div>' +
            '</div>' +
          '</div>';
      }

      var activeSections = diseaseDetailSections.filter(function (sec) {
        return sec.fields.some(function (f) { return d[f]; });
      });

      var catalogHtml = '';
      for (var key in sectionFieldMap) {
        var sec2 = sectionFieldMap[key];
        var fieldsHtml = '';
        sec2.fields.forEach(function (f) {
          fieldsHtml += '<div class="catalog-field-item" onclick="jumpToField(\'' + key + '\', \'' + f + '\', \'' + pageId + '\')">' + f + '</div>';
        });
        catalogHtml +=
          '<div class="catalog-section">' +
            '<div class="catalog-section-header" onclick="toggleCatalogSection(this)">' +
              '<span class="icon">' + icon(sec2.icon, 22) + '</span>' +
              '<div class="catalog-section-title">' + sec2.title + '</div>' +
              '<span class="catalog-section-chevron">' + icon('chevronDown', 18) + '</span>' +
            '</div>' +
            '<div class="catalog-section-body">' +
              '<div class="catalog-fields">' + fieldsHtml + '</div>' +
            '</div>' +
          '</div>';
      }

      var relatedMuscles = findRelatedMuscles(d['具体病症'] || '', d['部位'] || '');
      var relatedHtml = '';
      if (relatedMuscles.length > 0) {
        relatedHtml += '<div class="divider-section"></div>';
        relatedHtml += '<div class="section-title">' + icon('muscle', 20) + '相关肌肉</div>';
        relatedMuscles.forEach(function (rm) {
          relatedHtml +=
            '<div class="list-item" onclick="showMuscleDetail(' + rm.index + ')">' +
              icon(getMuscleRegion(rm.part).icon, 36) +
              '<div class="list-item-content">' +
                '<div class="list-item-title">' + rm.name + '</div>' +
                '<div class="list-item-desc">' + rm.part + '</div>' +
              '</div>' +
              '<div class="list-item-arrow">' + icon('chevronRight', 18) + '</div>' +
            '</div>';
        });
      }

      pageEl = document.createElement('div');
      pageEl.className = 'page';
      pageEl.id = 'page-' + pageId;

      var tagsHtml = '';
      if (d['疾病分类']) tagsHtml += '<span class="detail-tag">' + d['疾病分类'] + '</span>';
      if (d['疾病分级']) tagsHtml += '<span class="detail-tag">' + d['疾病分级'] + '</span>';
      if (d['证据等级(GRADE)']) tagsHtml += '<span class="detail-tag">GRADE: ' + d['证据等级(GRADE)'] + '</span>';
      if (hasRedFlag) tagsHtml += '<span class="detail-tag" style="background:rgba(239,68,68,0.3);cursor:pointer;" onclick="scrollToSection(\'redflag\')">⚠ 红旗征 →</span>';

      var subTitle = (d['部位'] || '') + (d['ICD-10编码'] ? ' · ' + d['ICD-10编码'] : '');

      var catalogPanelId = 'catalog-' + pageId;

      pageEl.innerHTML =
        '<div class="detail-header">' +
          '<div class="detail-header-title">' + (d['具体病症'] || '-') + '</div>' +
          '<div class="detail-header-sub">' + subTitle + '</div>' +
          '<div class="detail-tags">' + tagsHtml + '</div>' +
        '</div>' +
        illustrationHtml(getIllustration(getDiseaseRegion(d['部位']).id, d['具体病症']), d['具体病症']) +
        (hasRedFlag ? '<button class="redflag-btn" onclick="scrollToSection(\'redflag\')">' +
          '<span class="icon">' + icon('warning', 20) + '</span>' +
          '红旗征/紧急预警' +
          '<span class="redflag-arrow">' + icon('chevronRight', 18) + '</span>' +
        '</button>' : '') +
        '<button class="catalog-btn" onclick="openCatalog(\'' + catalogPanelId + '\')">' +
          '<span class="icon">' + icon('list', 20) + '</span>' +
          '查看目录' +
          '<span class="catalog-btn-count">' + activeSections.length + ' 个分类</span>' +
        '</button>' +
        '<div class="btn-row">' +
          '<button class="btn btn-outline" onclick="expandAllAccordion()">' +
            icon('expand', 16) +
            '全部展开' +
          '</button>' +
          '<button class="btn btn-outline" onclick="collapseAllAccordion()">' +
            icon('collapse', 16) +
            '全部收起' +
          '</button>' +
        '</div>' +
        sectionsHtml +
        relatedHtml +
        '<div class="catalog-panel" id="' + catalogPanelId + '">' +
          '<div class="catalog-header">' +
            '<button class="catalog-back" onclick="closeCatalog(\'' + catalogPanelId + '\')">' +
              '<span class="icon">' + icon('chevronLeft', 22) + '</span>' +
            '</button>' +
            '<div class="catalog-title">内容目录</div>' +
          '</div>' +
          '<div class="catalog-list">' + catalogHtml + '</div>' +
        '</div>';

      document.getElementById('content').appendChild(pageEl);
    }

    showPage(pageId);
    var titleEl2 = document.getElementById('navTitle');
    if (titleEl2) titleEl2.textContent = d['具体病症'] || '疾病详情';
  }

  // ═══════════════════════════════════════════════════
  //  6. 通用 UI 辅助（仅肌肉/疾病详情页使用）
  // ═══════════════════════════════════════════════════

  function toggleAccordion(headerEl) {
    var item = headerEl.parentElement;
    item.classList.toggle('open');
  }

  function expandAllAccordion() {
    document.querySelectorAll('.page.active .accordion-item').forEach(function (item) {
      item.classList.add('open');
    });
  }

  function collapseAllAccordion() {
    document.querySelectorAll('.page.active .accordion-item').forEach(function (item) {
      item.classList.remove('open');
    });
  }

  function scrollToSection(sectionKey) {
    var item = document.querySelector('.page.active .accordion-item[data-section="' + sectionKey + '"]');
    if (item) {
      item.classList.add('open');
      item.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function openCatalog(panelId) {
    var panel = document.getElementById(panelId);
    if (panel) panel.classList.add('open');
  }

  function closeCatalog(panelId) {
    var panel = document.getElementById(panelId);
    if (panel) panel.classList.remove('open');
  }

  function toggleCatalogSection(headerEl) {
    var section = headerEl.parentElement;
    section.classList.toggle('open');
  }

  function jumpToField(sectionKey, fieldName, pageId) {
    var panel = document.getElementById('catalog-page-' + pageId);
    if (panel) panel.classList.remove('open');

    var sectionItem = document.querySelector('#page-' + pageId + ' .accordion-item[data-section="' + sectionKey + '"]');
    if (sectionItem) {
      sectionItem.classList.add('open');
      var fieldEl = sectionItem.querySelector('.field-row[data-field="' + fieldName + '"]');
      if (fieldEl) {
        setTimeout(function () {
          fieldEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      } else {
        sectionItem.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    var catalogPanel = document.getElementById('catalog-page-' + pageId) || document.getElementById('catalog-' + pageId);
    if (catalogPanel) catalogPanel.classList.remove('open');
  }

  // ═══════════════════════════════════════════════════
  //  7. 搜索框事件绑定（DOM 已就绪后立即执行）
  // ═══════════════════════════════════════════════════

  function bindMuscleDiseaseSearch() {
    var muscleSearch = document.getElementById('muscleSearch');
    if (muscleSearch) {
      muscleSearch.addEventListener('input', function (e) {
        var kw = e.target.value.trim().toLowerCase();
        var muscleData = typeof muscles !== 'undefined' ? muscles : [];
        var grid = document.getElementById('muscleBodyGrid');

        if (!kw) {
          renderMuscleBodyGrid();
          if (grid) grid.style.display = '';
          return;
        }

        var filtered = muscleData.filter(function (m) {
          return (m['肌肉名称'] && m['肌肉名称'].toLowerCase().indexOf(kw) >= 0) ||
                 (m['主要功能'] && m['主要功能'].toLowerCase().indexOf(kw) >= 0) ||
                 (m['常见损伤'] && m['常见损伤'].toLowerCase().indexOf(kw) >= 0);
        });

        if (filtered.length > 0) {
          var html = '';
          for (var i = 0; i < filtered.length; i++) {
            var m = filtered[i];
            var idx = muscleData.indexOf(m);
            var desc = (m['身体区域'] || '') + ' · ' + (m['主要功能'] ? m['主要功能'].slice(0, 25) : '');
            html +=
              '<div class="list-item" onclick="showMuscleDetail(' + idx + ')">' +
                icon(getMuscleRegion(m['身体区域']).icon, 36) +
                '<div class="list-item-content">' +
                  '<div class="list-item-title">' + (m['肌肉名称'] || '-') + '</div>' +
                  '<div class="list-item-desc">' + desc + '</div>' +
                '</div>' +
                '<div class="list-item-arrow">' + icon('chevronRight', 18) + '</div>' +
              '</div>';
          }
          if (grid) {
            grid.innerHTML = html;
            grid.style.display = 'block';
          }
        } else {
          if (grid) {
            grid.innerHTML = '<div class="empty">' + icon('search', 48) + '<div>未找到相关肌肉</div></div>';
            grid.style.display = 'block';
          }
        }
      });
    }

    var diseaseSearch = document.getElementById('diseaseSearch');
    if (diseaseSearch) {
      diseaseSearch.addEventListener('input', function (e) {
        var kw = e.target.value.trim().toLowerCase();
        var diseaseData = typeof diseases !== 'undefined' ? diseases : [];
        var grid = document.getElementById('diseaseBodyGrid');

        if (!kw) {
          renderDiseaseBodyGrid();
          if (grid) grid.style.display = '';
          return;
        }

        var filtered = diseaseData.filter(function (d) {
          return (d['具体病症'] && d['具体病症'].toLowerCase().indexOf(kw) >= 0) ||
                 (d['ICD-10编码'] && d['ICD-10编码'].toLowerCase().indexOf(kw) >= 0) ||
                 (d['疾病分类'] && d['疾病分类'].toLowerCase().indexOf(kw) >= 0);
        });

        if (filtered.length > 0) {
          var html = '';
          for (var i = 0; i < filtered.length; i++) {
            var d = filtered[i];
            var idx = diseaseData.indexOf(d);
            var desc = (d['部位'] || '') + (d['ICD-10编码'] ? ' · ' + d['ICD-10编码'] : '');
            html +=
              '<div class="list-item" onclick="showDiseaseDetail(' + idx + ')">' +
                icon(getDiseaseRegion(d['部位']).icon, 36) +
                '<div class="list-item-content">' +
                  '<div class="list-item-title">' + (d['具体病症'] || '-') + '</div>' +
                  '<div class="list-item-desc">' + desc + '</div>' +
                '</div>' +
                '<div class="list-item-arrow">' + icon('chevronRight', 18) + '</div>' +
              '</div>';
          }
          if (grid) {
            grid.innerHTML = html;
            grid.style.display = 'block';
          }
        } else {
          if (grid) {
            grid.innerHTML = '<div class="empty">' + icon('search', 48) + '<div>未找到相关疾病</div></div>';
            grid.style.display = 'block';
          }
        }
      });
    }
  }

  // 立即绑定（脚本在 body 末尾引入，DOM 已就绪）
  bindMuscleDiseaseSearch();

  // ═══════════════════════════════════════════════════
  //  8. 导出（保持全局兼容，onclick 内联调用需要）
  // ═══════════════════════════════════════════════════

  global.renderMuscleBodyGrid = renderMuscleBodyGrid;
  global.showMuscleList = showMuscleList;
  global.showMuscleDetail = showMuscleDetail;
  global.renderDiseaseBodyGrid = renderDiseaseBodyGrid;
  global.showDiseaseList = showDiseaseList;
  global.showDiseaseDetail = showDiseaseDetail;
  global.findRelatedDiseases = findRelatedDiseases;
  global.findRelatedMuscles = findRelatedMuscles;
  global.getMuscleRegion = getMuscleRegion;
  global.getDiseaseRegion = getDiseaseRegion;
  global.getIllustration = getIllustration;
  global.illustrationHtml = illustrationHtml;

  global.toggleAccordion = toggleAccordion;
  global.expandAllAccordion = expandAllAccordion;
  global.collapseAllAccordion = collapseAllAccordion;
  global.scrollToSection = scrollToSection;
  global.openCatalog = openCatalog;
  global.closeCatalog = closeCatalog;
  global.toggleCatalogSection = toggleCatalogSection;
  global.jumpToField = jumpToField;

})(typeof window !== 'undefined' ? window : this);
