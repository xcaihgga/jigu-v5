/**
 * 知识测验 UI（第 4 批）
 * 数据来源：window.quizData（quiz.js）
 *
 * 功能：
 *   - 三类题库分类切换
 *   - 练习模式（选答案即时显示解析）/ 考试模式（提交后才显示解析）
 *   - 交卷评分 + 错题解析 + 重新作答
 *
 * 依赖（全局）：无强依赖，纯隔离 DOM 操作。
 */
(function (global) {
  'use strict';

  var currentCat = 'scale';
  var practiceMode = true;       // true=练习(即时显示), false=考试(提交后显示)
  // 每个分类独立记录作答与提交状态
  var state = {};                // catId -> { choices: {qIdx: sel}, submitted: bool }

  function catQuestions(catId) {
    var data = (global.quizData || {}).categories || [];
    for (var i = 0; i < data.length; i++) {
      if (data[i].id === catId) return data[i].questions || [];
    }
    return [];
  }

  function catName(catId) {
    var data = (global.quizData || {}).categories || [];
    for (var i = 0; i < data.length; i++) {
      if (data[i].id === catId) return data[i].name;
    }
    return '';
  }

  function getState(catId) {
    if (!state[catId]) state[catId] = { choices: {}, submitted: false };
    return state[catId];
  }

  function resetState(catId) {
    state[catId] = { choices: {}, submitted: false };
  }

  // ─────────── 分类栏 ───────────
  function renderQuizCatBar() {
    var bar = document.getElementById('quizCatBar');
    if (!bar) return;
    var data = (global.quizData || {}).categories || [];
    bar.innerHTML = data.map(function (c) {
      return '<button class="quick-nav-item ' + (c.id === currentCat ? 'active' : '') +
        '" onclick="quizSelectCategory(\'' + c.id + '\')">' + c.name +
        '<span class="quiz-count">' + c.questions.length + '题</span></button>';
    }).join('');
  }

  // ─────────── 渲染题目列表 ───────────
  function renderQuizList() {
    var box = document.getElementById('quizList');
    if (!box) return;
    var qs = catQuestions(currentCat);
    if (qs.length === 0) { box.innerHTML = '<div class="empty-state">暂无题目</div>'; return; }

    var st = getState(currentCat);

    box.innerHTML = qs.map(function (item, qi) {
      // 模式判定：练习模式总是显示结果；考试模式提交后显示结果
      var showResult = practiceMode || st.submitted;
      var opts = item.options.map(function (opt, oi) {
        // 已选状态
        var selected = st.choices[qi] === oi;
        var cls = ['quiz-opt'];
        var mark = '';
        if (showResult) {
          if (oi === item.answer) { cls.push('quiz-opt-correct'); mark = '✓'; }
          else if (selected) { cls.push('quiz-opt-wrong'); mark = '✗'; }
          else if (selected) { cls.push('quiz-opt-picked'); }
        } else {
          if (selected) cls.push('quiz-opt-picked');
        }
        return '<div class="' + cls.join(' ') + '" onclick="quizChoose(' + qi + ',' + oi + ')">' +
          '<span class="quiz-opt-key">' + String.fromCharCode(65 + oi) + '</span>' +
          '<span class="quiz-opt-text">' + opt + '</span>' + mark +
        '</div>';
      }).join('');

      var explainHtml = '';
      if (showResult) {
        explainHtml = '<div class="quiz-explain"><b>解析：</b>' + item.explain +
          (item.source ? ' <span class="quiz-src">（来源：' + item.source + '）</span>' : '') + '</div>';
      }

      return '<div class="quiz-question">' +
        '<div class="quiz-q-head"><span class="quiz-q-num">' + (qi + 1) + '</span>' +
          '<span class="quiz-q-text">' + item.q + '</span></div>' +
        '<div class="quiz-opts">' + opts + '</div>' + explainHtml +
      '</div>';
    }).join('');

    // 底部操作区
    var foot = document.getElementById('quizFoot');
    if (foot) {
      if (practiceMode) {
        foot.innerHTML = '<div class="quiz-foot-tip">练习模式：点击选项即时显示对错与解析</div>' +
          '<button class="btn btn-primary" onclick="quizReset(\'' + currentCat + '\')">重新作答</button>';
      } else {
        var answered = Object.keys(st.choices).length;
        var status = st.submitted
          ? '<span class="quiz-submitted">已完成</span>'
          : '已答 ' + answered + ' / ' + qs.length;
        foot.innerHTML = '<div class="quiz-foot-tip">考试模式：选择后点"交卷"，提交后统一显示解析</div>' +
          '<button class="btn btn-primary" ' + (st.submitted ? 'disabled' : '') + ' onclick="quizSubmit(\'' + currentCat + '\')">交卷</button> ' +
          '<button class="btn btn-outline" onclick="quizReset(\'' + currentCat + '\')">重新作答</button>';
        if (st.submitted) {
          var score = qs.reduce(function (acc, it, qi) { return acc + (st.choices[qi] === it.answer ? 1 : 0); }, 0);
          foot.innerHTML += '<div class="quiz-score ' + (score === qs.length ? 'quiz-score-perfect' : '') + '">得分：' + score + ' / ' + qs.length + (score === qs.length ? ' ，全对' : '') + '</div>';
        }
      }
    }
  }

  // ─────────── 交互 ───────────
  function quizSelectCategory(catId) {
    currentCat = catId;
    renderQuizCatBar();
    renderQuizList();
  }

  function quizToggleMode(val) {
    practiceMode = !!val;
    renderQuizList();
  }

  function quizChoose(qi, oi) {
    var st = getState(currentCat);
    if (st.submitted) return; // 提交后锁定
    st.choices[qi] = oi;
    renderQuizList();
  }

  function quizSubmit(catId) {
    var st = getState(catId);
    st.submitted = true;
    renderQuizList();
  }

  function quizReset(catId) {
    resetState(catId);
    renderQuizList();
  }

  // ─────────── 主入口 ───────────
  function renderQuiz() {
    renderQuizCatBar();
    renderQuizList();
  }

  global.renderQuiz = renderQuiz;
  global.quizSelectCategory = quizSelectCategory;
  global.quizToggleMode = quizToggleMode;
  global.quizChoose = quizChoose;
  global.quizSubmit = quizSubmit;
  global.quizReset = quizReset;
})(window);