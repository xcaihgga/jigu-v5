/**
 * ═══════════════════════════════════════════════════════════════
 *  通用工具函数 utils.js
 *  从 index.html 内联脚本拆分而来，全部为纯函数 / DOM 安全函数。
 *  依赖：无（logger.js 可选，本文件不直接调用 interactionLog）
 * ═══════════════════════════════════════════════════════════════
 *
 *  导出（挂到全局作用域，供后续脚本以裸名调用）：
 *    - iconSvg / icon / setIcon / initIcons   图标
 *    - escapeHtml                            XSS 转义
 *    - safeGetJSON                           localStorage 安全读取
 *    - formatContent                         文本 → HTML 格式化
 *    - getInterpretation                     分数解读
 *    - formatDate / formatDateShort          日期格式化
 */

// ═══════════════════════════════════════════════════════════════
//  1. 图标 SVG 集合
// ═══════════════════════════════════════════════════════════════
const iconSvg = {
  muscle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 6.5L3 9v6l3.5 2.5L9 15h6l2.5 2.5 2.5-2.5L21 15V9l-3.5-2.5L15 9H9L6.5 6.5Z"/><circle cx="12" cy="12" r="2"/></svg>',
  diagnosis: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>',
  assessment: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M7 14l4-4 4 4 5-5"/></svg>',
  patient: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
  back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>',
  chevronDown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>',
  chevronRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>',
  chevronLeft: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
  list: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>',
  calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
  chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
  body: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="4" r="2.5"/><path d="M12 7v6"/><path d="M8 10h8"/><path d="M7 21l5-8 5 8"/></svg>',
  joint: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="7"/><path d="M5 12h14M12 5v14"/></svg>',
  head: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="9" r="5"/><path d="M9 18l1.5 2 1.5-2 1.5 2 1.5-2"/></svg>',
  neck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="3"/><path d="M9 8v3M15 8v3M8 11h8"/><path d="M6 11h12l-1.5 4h-9L6 11z"/></svg>',
  shoulder: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/></svg>',
  backBody: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l7 4v6c0 5-3.5 9-7 10-3.5-1-7-5-7-10V6l7-4z"/><path d="M12 6v12"/></svg>',
  chest: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4h12v7c0 4-2.5 7-6 7s-6-3-6-7V4z"/><path d="M6 8h12"/></svg>',
  arm: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6c4-2 8-2 12 0v4c0 2 1 3 2 4v6c0 2-2 3-4 2-2-1-4-1-6 0-2 1-4 1-6 0-2-1-4 0-4-2v-6c1-1 2-2 2-4V6z"/></svg>',
  hand: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3v8M12 2v9M16 3v8M4 6v7M20 7v7"/><path d="M4 13c0 5 3 8 8 8h5c0 0-3 0-8 3-5-3-8-5-8-8v-3z"/></svg>',
  pelvis: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10h18v4c0 3-3 6-9 6s-9-3-9-6v-4z"/><path d="M8 10V7c0-2 2-4 4-4s4 2 4 4v3"/></svg>',
  thigh: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2v6c0 3 2 5 4 5s4-2 4-5V2"/><path d="M8 11v7c0 2 1 3 2 4h0c1-1 2-2 2-4v-7"/><path d="M6 18h12"/></svg>',
  foot: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 17c0-3 2-5 5-5h6c2 0 3 1 3 3v3H6H4v-4z"/><circle cx="8" cy="10" r="2"/><path d="M12 8V5M16 9V4M20 10V6"/></svg>',
  knee: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="7"/><path d="M8 12h8M12 8v8"/></svg>',
  cervical: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="4" r="2.5"/><path d="M9.5 7v2M14.5 7v2"/><path d="M10 11h4"/><path d="M9 13h6l-1 4h-4l-1-4z"/></svg>',
  thoracic: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20"/><path d="M8 5h8M7 9h10M7 13h10M8 17h8"/></svg>',
  lumbar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v3M12 19v3M5 7l3 2M19 7l-3 2M5 17l3-2M19 17l-3-2"/><ellipse cx="12" cy="12" rx="7" ry="5"/></svg>',
  'shoulder-joint': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="14" r="6"/><path d="M12 2v6"/><circle cx="12" cy="2" r="1"/></svg>',
  elbow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8c4-2 8-2 12 0v4c0 3-2 6-6 8s-6 2-6-2V8z"/><circle cx="10" cy="14" r="2"/></svg>',
  wrist: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 4v8c0 2 1 3 2 4h6c1-1 2-2 2-4V4"/><path d="M7 12h10"/><path d="M8 20h8"/></svg>',
  'pelvis-joint': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10h18v4c0 3-3 6-9 6s-9-3-9-6v-4z"/><circle cx="8" cy="13" r="1.5"/><circle cx="16" cy="13" r="1.5"/></svg>',
  hip: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="5"/><path d="M12 13v9"/></svg>',
  ankle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="17" rx="6" ry="2"/><path d="M9 5v12M15 5v12M7 9h10"/></svg>',
  basics: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>',
  symptoms: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v5M12 16v.01"/></svg>',
  treatment: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>',
  rehab: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 6.5l11 11"/><path d="M21 21l-1-1M3 3l1 1M18 22l4-4M2 6l4-4"/></svg>',
  prognosis: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
  evidence: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
  warning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
  other: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01"/></svg>',
  pain: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
  function: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>',
  balance: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20"/><path d="M5 8h14"/><path d="M3 21h18"/></svg>',
  quality: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
  mental: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.04z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.04z"/></svg>',
  muscleTest: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 20H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v1m2 13a2 2 0 0 1-2 2z"/></svg>',
  save: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>',
  download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
  copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
  expand: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>',
  collapse: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="14" y1="10" x2="21" y2="3"/><line x1="3" y1="21" x2="10" y2="14"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
  edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
  home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  filter: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>',
  share: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>',
  refresh: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>',
  info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
  protocol: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/><line x1="8" y1="9" x2="10" y2="9"/></svg>',
  dashboard: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>',
  neck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M9 11v5a3 3 0 0 0 6 0v-5"/><path d="M7 22c1.5-2 2.5-4 5-4s3.5 2 5 4"/></svg>',
  brain: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.04z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.04z"/></svg>',
  mouth: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14a8 8 0 0 1 16 0"/><path d="M4 14v2a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4v-2"/><line x1="8" y1="14" x2="8" y2="16"/><line x1="12" y1="14" x2="12" y2="18"/><line x1="16" y1="14" x2="16" y2="16"/></svg>',
  throat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6l-1 7H10z"/><path d="M10 10c-1 3-2 6-2 8a4 4 0 0 0 8 0c0-2-1-5-2-8"/><line x1="10" y1="14" x2="14" y2="14"/></svg>',
  lung: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v8"/><path d="M8 7L6 10v8a3 3 0 0 0 3 3 3 3 0 0 0 3-3V10L8 7z"/><path d="M16 7l2 3v8a3 3 0 0 1-3 3 3 3 0 0 1-3-3V10l4-3z"/></svg>',
  spine: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20"/><path d="M8 4l4 2 4-2"/><path d="M8 8l4 2 4-2"/><path d="M8 12l4 2 4-2"/><path d="M8 16l4 2 4-2"/><path d="M8 20l4 2 4-2"/></svg>',
  body: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="2"/><path d="M12 7v10M8 10h8M9 22l3-5 3 5"/></svg>',
};

function icon(name, size) {
  const s = size || 24;
  return '<span class="icon" style="width:' + s + 'px;height:' + s + 'px;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;">' + (iconSvg[name] || iconSvg.other) + '</span>';
}

function setIcon(elementId, name, size) {
  const el = document.getElementById(elementId);
  if (el) {
    el.innerHTML = iconSvg[name] || iconSvg.other;
    if (size) {
      el.style.width = size + 'px';
      el.style.height = size + 'px';
    }
  }
}

function initIcons() {
  setIcon('navBackIcon', 'back', 22);
  setIcon('navSearchIcon', 'search', 22);
  setIcon('muscleSearchIcon', 'search', 18);
  setIcon('muscleBodyIcon', 'body', 20);
  setIcon('diseaseSearchIcon', 'search', 18);
  setIcon('diseaseJointIcon', 'joint', 20);
  setIcon('patientSearchIcon', 'search', 18);
  setIcon('addPatientIcon', 'plus', 18);
  setIcon('patientCrumbIcon', 'back', 18);
  setIcon('exportCsvIcon', 'download', 16);
  setIcon('scaleListIcon', 'list', 16);
  setIcon('scaleHistoryIcon', 'calendar', 16);
  setIcon('scaleChartIcon', 'chart', 16);
  setIcon('toolsSearchIcon', 'search', 18);
  setIcon('guidelinesSearchIcon', 'search', 18);
  setIcon('tabMuscleIcon', 'muscle', 24);
  setIcon('tabDiagnosisIcon', 'diagnosis', 24);
  setIcon('tabAssessmentIcon', 'assessment', 24);
  setIcon('tabToolsIcon', 'function', 24);
  setIcon('tabGuidelinesIcon', 'evidence', 24);
  setIcon('tabProtocolIcon', 'protocol', 24);
  setIcon('tabDashboardIcon', 'dashboard', 24);
  setIcon('tabPatientIcon', 'patient', 24);
}

// ═══════════════════════════════════════════════════════════════
//  2. HTML 转义：防止用户输入字段注入 HTML/脚本
//     用于任何把用户可控数据（患者姓名、诊断、主诉、备注等）拼进 innerHTML 的场景
// ═══════════════════════════════════════════════════════════════
function escapeHtml(val) {
  if (val === null || val === undefined) return '';
  return String(val)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ═══════════════════════════════════════════════════════════════
//  2.5 属性值转义：防止用户可控数据拼进 HTML 属性时打破属性边界
//       用于任何把用户可控数据（PSFS 活动名、量表默认值等）拼进 value/placeholder/onclick 等属性的场景
//       比 escapeHtml 额外覆盖反引号，兼容 HTML5 带引号属性的各种边界情况
// ═══════════════════════════════════════════════════════════════
function escapeAttr(val) {
  if (val === null || val === undefined) return '';
  return String(val)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/`/g, '&#96;');
}

// ═══════════════════════════════════════════════════════════════
//  3. 安全读取 localStorage 的 JSON 数据
//     - 解析失败时清理损坏数据、返回 fallback、一次性提示用户
//     - 避免 JSON.parse 抛 SyntaxError 导致整个业务函数中断
//     @param {string} key localStorage 键名
//     @param {*} fallback 解析失败时的返回值（默认 []）
// ═══════════════════════════════════════════════════════════════
var __lsCorruptWarned = false;
function safeGetJSON(key, fallback) {
  var fb = (fallback === undefined) ? [] : fallback;
  try {
    var raw = localStorage.getItem(key);
    if (raw === null) return fb;
    return JSON.parse(raw);
  } catch (e) {
    console.warn('[Storage] localStorage["' + key + '"] 数据损坏，已重置:', e && e.message ? e.message : e);
    try { localStorage.removeItem(key); } catch (_) {}
    if (!__lsCorruptWarned) {
      __lsCorruptWarned = true;
      setTimeout(function() {
        alert('检测到本地存储数据损坏，已自动重置受影响的数据。此前保存的部分记录可能丢失。');
        __lsCorruptWarned = false;
      }, 0);
    }
    return fb;
  }
}

// ═══════════════════════════════════════════════════════════════
//  3.5 安全写入 localStorage 的 JSON 数据
//      - 对 JSON.stringify + setItem 全链路 try-catch
//      - 避免 QuotaExceededError / 隐私模式禁用 localStorage 时中断业务
//      @param {string} key localStorage 键名
//      @param {*} value 要写入的值（会被 JSON.stringify）
//      @returns {boolean} 是否写入成功
// ═══════════════════════════════════════════════════════════════
function safeSetJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    var msg = e && e.message ? e.message : String(e);
    console.error('[Storage] localStorage["' + key + '"] 写入失败:', msg);
    if (/quota|exceed|storage/i.test(msg) || (e && e.name === 'QuotaExceededError')) {
      alert('本地存储已满，无法保存数据。请清理浏览器存储后重试。');
    } else {
      alert('保存失败：' + msg);
    }
    return false;
  }
}

// ═══════════════════════════════════════════════════════════════
//  4. 文本 → HTML 格式化
//     支持：标题(#/##/###)、有序/无序列表、分隔线、小标题、加粗、段落
// ═══════════════════════════════════════════════════════════════
function formatContent(text) {
  if (!text) return '';
  let html = String(text).trim();

  html = html.replace(/\r\n/g, '\n');
  html = html.replace(/\*\*(.+?)\*\*/g, '$1');
  html = html.replace(/\*/g, '·');
  html = html.replace(/^###\s+/gm, '');
  html = html.replace(/^##\s+/gm, '');
  html = html.replace(/^#\s+/gm, '');

  if (html.includes('\n')) {
    const blocks = html.split(/\n{2,}/);
    html = blocks.map(block => {
      block = block.trim();
      if (!block) return '';

      if (/^---+$/.test(block)) {
        return '<div class="divider"></div>';
      }

      const lines = block.split('\n');
      let hasList = false;
      const processed = lines.map(line => {
        if (/^\d+[\.、)）]/.test(line.trim())) {
          hasList = true;
          return { type: 'li-ol', text: line.trim().replace(/^\d+[\.、)）]\s*/, '') };
        }
        if (/^[•·\-●★]/.test(line.trim())) {
          hasList = true;
          return { type: 'li-ul', text: line.trim().replace(/^[•·\-●★]\s*/, '') };
        }
        if (/^(核心|补充|注意|禁忌|原则|要点|适应症|禁忌症|目的|目标|方法|一、|二、|三、|四、|五、|六、|七、|八、|九、|十、)/.test(line.trim())) {
          const titleLine = line.trim();
          const colonMatch = titleLine.match(/^(.+?)[：:](.*)$/);
          if (colonMatch && colonMatch[2]) {
            return { type: 'subtitle-with-content', title: colonMatch[1], content: colonMatch[2] };
          }
          return { type: 'subtitle', text: titleLine };
        }
        return { type: 'p', text: line };
      });

      if (hasList || processed.some(p => p.type === 'subtitle' || p.type === 'subtitle-with-content')) {
        let result = '';
        let inList = false;
        let listType = '';
        processed.forEach(item => {
          if (item.type === 'li-ol' || item.type === 'li-ul') {
            const lt = item.type === 'li-ol' ? 'ol' : 'ul';
            if (!inList) {
              listType = lt;
              result += '<' + listType + '>';
              inList = true;
            } else if (listType !== lt) {
              result += '</' + listType + '>';
              listType = lt;
              result += '<' + listType + '>';
            }
            result += '<li>' + item.text + '</li>';
          } else if (item.type === 'subtitle') {
            if (inList) {
              result += '</' + listType + '>';
              inList = false;
            }
            result += '<div class="sub-title">' + item.text + '</div>';
          } else if (item.type === 'subtitle-with-content') {
            if (inList) {
              result += '</' + listType + '>';
              inList = false;
            }
            result += '<div class="sub-title">' + item.title + '</div><p>' + item.content + '</p>';
          } else {
            if (inList) {
              result += '</' + listType + '>';
              inList = false;
            }
            result += '<p>' + item.text + '</p>';
          }
        });
        if (inList) result += '</' + listType + '>';
        return result;
      }

      return '<p>' + block.replace(/\n/g, '<br>') + '</p>';
    }).join('');
  } else {
    html = '<p>' + html + '</p>';
  }

  return html;
}

// ═══════════════════════════════════════════════════════════════
//  5. 分数解读：根据分数返回对应的解读档位
// ═══════════════════════════════════════════════════════════════
function getInterpretation(score, maxScore, interpretations) {
  const sorted = [...interpretations].sort((a, b) => a.min - b.min);
  for (let i = sorted.length - 1; i >= 0; i--) {
    if (score >= sorted[i].min) {
      return sorted[i];
    }
  }
  return sorted[0] || { level: '未知', color: 'other', desc: '' };
}

// ═══════════════════════════════════════════════════════════════
//  6. 日期格式化
// ═══════════════════════════════════════════════════════════════
function formatDate(date) {
  const d = new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const h = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return y + '-' + m + '-' + day + ' ' + h + ':' + min;
}

function formatDateShort(date) {
  const d = new Date(date);
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return m + '/' + day;
}
