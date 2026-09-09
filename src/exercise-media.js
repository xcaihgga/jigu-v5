/**
 * 动作素材匹配模块（第 5 批，GIF 动效替代方案）
 *
 * 设计决策：
 *   - 本仓库暂无 GIF，采用 assets/illustrations/ 下现有 webp 插图做"动效替代"：
 *     匹配到的插图以 CSS 过渡动画（两帧切换感）呈现，点击"播放"可模拟动作方向。
 *   - 匹配策略：自动按动作文本关键词匹配插图，命中则显示，不命中则回退纯文字。
 *   - 不硬编码到具体动作索引；新增插图只需在 MEDIA 清单里加一行关键词即可生效。
 *
 * 暴露：
 *   window.exerciseMedia.findForAction(text) -> { path, name, match } | null
 *   window.exerciseMedia.listAll() -> [{ path, name, keywords }]
 */
(function (global) {
  'use strict';

  // ═══════════════════ 可用插图清单（keywords 为中文匹配词） ═══════════════════
  // path 为 assets/illustrations/ 下的文件名
  var MEDIA = [
    { name: '肩拉伸', path: 'assets/illustrations/rehab-shoulder-stretch.webp', keywords: ['肩', '肩胛', '外旋', '外展', '上举', '前屈', '后伸', '拉伸', '牵拉肩', '冈上', '肩袖'] },
    { name: '膝康复', path: 'assets/illustrations/rehab-knee-rehabilitation.webp', keywords: ['膝', '股四头', '静蹲', '腘绳肌', '髌骨', '下蹲', '弓步', '台阶', '腿屈伸', 'ACL', '半月板', '髌股', '直腿抬高'] },
    { name: '踝练习', path: 'assets/illustrations/rehab-ankle-exercise.webp', keywords: ['踝', '勾脚', '绷脚', '踝泵', '背屈', '跖屈', '内翻', '外翻', '腓骨', '胫骨前'] },
    { name: '单腿站立', path: 'assets/illustrations/rehab-single-leg-stance.webp', keywords: ['单腿', '单脚', '站立平衡', '单腿站'] },
    { name: '平衡训练', path: 'assets/illustrations/rehab-balance-training.webp', keywords: ['平衡', '本体感觉', '平衡板', '平衡垫', '防跌倒', '坐站'] },
    { name: 'BOSU 本体感觉', path: 'assets/illustrations/rehab-proprioception-bosu.webp', keywords: ['bosu', '不稳定面', '干扰', '本体'] },
    { name: '弹力带抗阻', path: 'assets/illustrations/rehab-resistance-band.webp', keywords: ['弹力带', '抗阻', '阻力带', '橡皮筋', '等张', '渐进抗阻'] },
    { name: '泡沫轴', path: 'assets/illustrations/rehab-foam-roller.webp', keywords: ['泡沫轴', '滚筒', '筋膜放松', '滚压'] },
    { name: '手治疗', path: 'assets/illustrations/rehab-hand-therapy.webp', keywords: ['手', '握', '抓', '捏', '精细', '手指', '腕'] },
    { name: '闭链训练', path: 'assets/illustrations/rehab-closed-chain-exercise.webp', keywords: ['闭链', '静蹲', '卧蹬', '深蹲', '核心', '平板', '鸟狗', '支撑'] },
    { name: '敏捷梯', path: 'assets/illustrations/rehab-agility-ladder.webp', keywords: ['敏捷', '绳梯', '侧向滑步', '协调', '步伐'] },
    { name: '水中训练', path: 'assets/illustrations/rehab-swimming-pool.webp', keywords: ['游泳', '水中', '水疗', '池'] },
    { name: '腰背', path: 'assets/illustrations/rehab-back-pain.webp', keywords: ['腰', '背', '核心', '脊柱', '姿势矫正', '神经松动'] },
    { name: '干扰训练', path: 'assets/illustrations/rehab-perturbation-training.webp', keywords: ['干扰', '推', '突然'] },
    { name: '眼手协调', path: 'assets/illustrations/rehab-eye-hand-coordination.webp', keywords: ['眼手', '手眼', '协调', '接球'] },
    { name: '物理治疗', path: 'assets/illustrations/rehab-physical-therapy.webp', keywords: ['物理治疗', '手法', '按摩', '理疗', '电刺激', '项韧带', '颈椎', '松解', '放松'] },
    { name: '运动贴布', path: 'assets/illustrations/rehab-elastic-tape.webp', keywords: ['贴扎', '肌内效', '贴布'] },
    { name: '跑步', path: 'assets/illustrations/sport-running.webp', keywords: ['跑', '慢跑', '倒跑', '冲刺'] },
    { name: '力量训练', path: 'assets/illustrations/sport-strength.webp', keywords: ['力量', '举重', '负重', '哑铃', '杠铃'] },
    { name: '篮球', path: 'assets/illustrations/sport-basketball.webp', keywords: ['篮球', '变向', '急停', '跳投'] },
    { name: '瑜伽', path: 'assets/illustrations/sport-yoga.webp', keywords: ['瑜伽', '拉伸', '柔韧性', '冥想'] }
  ];

  // ═══════════════════ 匹配逻辑 ═══════════════════

  /**
   * 根据动作文本找最匹配的插图
   * @param {string} actionText - 动作描述（原始 exercises 字符串或 setup/keyPoints）
   * @returns {{path:string,name:string,match:number}|null}
   */
  function findForAction(actionText) {
    if (!actionText || typeof actionText !== 'string') return null;
    var text = actionText.toLowerCase();
    var best = null;
    MEDIA.forEach(function (m) {
      var score = 0;
      m.keywords.forEach(function (kw) {
        if (text.indexOf(kw.toLowerCase()) >= 0) score += kw.length; // 越长越具体，权重越高
      });
      if (score > 0) {
        if (!best || score > best.match ||
            (score === best.match && m.keywords.length < best.kwCount)) {
          // 分数相同则关键词数更少者优先（更专指）
          best = { path: m.path, name: m.name, match: score, kwCount: m.keywords.length };
        }
      }
    });
    return best;
  }

  function listAll() {
    return MEDIA.map(function (m) {
      return { path: m.path, name: m.name, keywords: m.keywords.slice() };
    });
  }

  // ═══════════════════ 动效播放控制（两帧切换替代 GIF） ═══════════════════
  // 点击"播放"时给图片加一个 1.2s 的位移动画，模拟"起始→终末位"的动作方向
  var ANIM_DURATION = 1200; // ms
  function emTogglePlay(btn) {
    if (!btn) return;
    var frame = btn.closest ? btn.closest('.teach-media').querySelector('.teach-media-frame')
                           : btn.parentNode.parentNode.querySelector('.teach-media-frame');
    if (!frame) return;
    // 防止重复触发叠加
    if (frame.classList.contains('em-playing')) return;
    frame.classList.add('em-playing');
    btn.textContent = '⏸ 播放中...';
    btn.disabled = true;
    setTimeout(function () {
      frame.classList.remove('em-playing');
      btn.textContent = '▶ 播放动效';
      btn.disabled = false;
    }, ANIM_DURATION);
  }

  global.exerciseMedia = {
    findForAction: findForAction,
    listAll: listAll
  };
  // 全局暴露播放控制，供 inline onclick 调用
  global.emTogglePlay = emTogglePlay;
})(window);