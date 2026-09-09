/**
 * 迁移报告数据（供「迁移报告」页面渲染使用）
 *
 * 为什么是 .js 而不是 .json？
 * - 主应用通过 <script> 标签加载数据文件，可在 file:// 本地双击打开时正常读取；
 * - 若用 fetch('migration-report.json')，本地 file:// 场景会被浏览器 CORS 拦截，
 *   导致本地版与公网版不一致。
 *
 * 数据源：src/migration-report.json（由 migrate-data.ts 生成，本项目为静态快照）
 * 若重新运行 migrate-data.ts 生成新报告，请同步更新本文件中的 window.MIGRATION_REPORT 内容。
 */
window.MIGRATION_REPORT = {
  "generatedAt": "2026-08-05T01:16:05.989Z",
  "systemStatus": "degraded",
  "scales": {
    "total": 31,
    "migrated": 31,
    "failed": 0,
    "errors": [],
    "versions": [
      "1.0.0"
    ],
    "sources": [
      "中华医学会疼痛学分会推荐",
      "国际疼痛研究协会(IASP)推荐",
      "初级保健疼痛评估工具",
      "Vernon H, Mior S. The Neck Disability Index. J Manipulative Physiol Ther. 1991.",
      "Japanese Orthopaedic Association",
      "Fairbank JC et al. The Oswestry Low Back Pain Disability Questionnaire. Physiotherapy. 1980.",
      "Roland M, Morris R. A study of the natural history of back pain. Part I. Spine. 1983.",
      "University of California, Los Angeles",
      "Constant CR, Murley AH. Clinical method of functional assessment of the shoulder. Clin Orthop. 1987.",
      "Hudak PL et al. Development of an upper extremity outcome measure. Am J Ind Med. 1996.",
      "Beaton DE et al. QuickDASH. J Hand Ther. 2005.",
      "Cooney WP et al. Clinical evaluation of wrist disorders. J Bone Joint Surg. 1981.",
      "Mayo Clinic Elbow Performance Score",
      "Harris WH. Traumatic arthritis of the hip. J Bone Joint Surg. 1969.",
      "Lysholm J, Gillquist J. Evaluation of knee ligament surgery results. Am J Sports Med. 1982.",
      "Oxford Knee Score, 1998",
      "International Knee Documentation Committee",
      "American Orthopaedic Foot and Ankle Society",
      "Foot and Ankle Ability Measure",
      "Stratford PW et al. Patient-specific functional scale. Phys Ther. 1995.",
      "Mahoney FI, Barthel DW. Functional evaluation: the Barthel Index. 1965.",
      "Uniform Data System for Medical Rehabilitation",
      "Berg KO et al. Measuring balance in the elderly. Can J Public Health. 1989.",
      "Holden MK et al. Functional gait categories. Phys Ther. 1984.",
      "Ware JE Jr et al. SF-12 Health Survey. 1996.",
      "Kendall FP. Muscles: Testing and Function.",
      "关节活动度测量标准",
      "Modified Ashworth Scale",
      "Spitzer RL et al. A brief measure for assessing generalized anxiety disorder. Arch Intern Med. 2006.",
      "Kroenke K et al. The PHQ-9. J Gen Intern Med. 2001."
    ]
  },
  "protocols": {
    "total": 3,
    "migrated": 3,
    "failed": 0,
    "errors": [],
    "versions": [
      "1.0.0"
    ],
    "sources": [
      "基于AACP指南与最新循证医学证据",
      "基于中国脑卒中康复治疗指南与国际循证证据",
      "基于OARSI指南和AAOS膝OA临床实践指南"
    ]
  },
  "calculationSpotCheck": {
    "passed": 6,
    "failed": 0
  },
  "selfCheck": {
    "scaleValid": 31,
    "scaleInvalid": 0,
    "warnings": 1,
    "protocolValid": 3,
    "protocolInvalid": 0
  }
};