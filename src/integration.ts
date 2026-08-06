/**
 * ⚠️ 状态：TypeScript 架构草稿，**不在当前 index.html 单文件主链路运行**。
 * ⚠️ 启用条件：需添加 tsconfig.json + 构建脚本（如 tsc/esbuild），编译输出到 src/ 目录后由 index.html 引入。
 *
 * 集成入口：连接原始数据与新数据服务
 * 
 * 这是应用启动时的入口点，负责：
 * 1. 导入所有原始临床数据
 * 2. 调用数据服务初始化
 * 3. 运行自检
 * 4. 提供给 UI 层使用
 */

import { initializeDataService, getAllScales, getAllProtocols, getScaleById, getProtocolById, getVersionInfo, getSelfCheckReport } from './services/dataService';

// 导入原始数据（从现有的 JS 文件）
// 注意：这里使用 require 是因为原始文件是 CommonJS 格式
// 在实际项目中可能需要使用 import 或构建工具的别名

// 由于无法直接 require，我们创建一个 mock 的加载方式
// 实际应用中应使用动态导入或打包工具

// ========== 模拟原始数据 ==========
// 这里我们创建一些示例数据来演示系统工作
// 真实应用应从 scales.js, protocols-pro.js 等文件加载

const mockVASScale = {
  id: 'vas',
  name: 'VAS 视觉模拟疼痛评分',
  shortName: 'VAS',
  category: 'pain',
  description: '最常用的疼痛评估工具',
  reliability: '信度高',
  reference: '中华医学会疼痛学分会推荐',
  totalScore: 10,
  type: 'slider',
  question: '请标记您当前的疼痛程度',
  labels: ['无痛', '最剧烈疼痛'],
  interpretation: [
    { min: 0, max: 0, level: '无痛', color: 'success', desc: '无疼痛感觉' },
    { min: 1, max: 3, level: '轻度疼痛', color: 'success', desc: '疼痛轻微，不影响日常生活' },
    { min: 4, max: 6, level: '中度疼痛', color: 'warning', desc: '疼痛明显，影响部分日常活动' },
    { min: 7, max: 10, level: '重度疼痛', color: 'danger', desc: '疼痛剧烈，严重影响日常生活' }
  ],
  calculate: function(answers: any[]) {
    return { score: answers[0] || 0, maxScore: 10 };
  }
};

const mockNASSScale = {
  id: 'nas',
  name: 'NASS 颈椎功能障碍指数',
  shortName: 'NASS',
  category: 'function',
  description: '评估颈椎功能障碍程度',
  reliability: 'Cronbach α = 0.89',
  reference: 'Vernon & Mior (1991)',
  totalScore: 50,
  type: 'number',
  version: '2.0',
  source: '北美脊柱外科学会',
  interpretation: [
    { min: 0, max: 15, level: '轻度障碍', color: 'success', desc: '日常生活不受影响' },
    { min: 16, max: 34, level: '中度障碍', color: 'warning', desc: '日常活动受影响' },
    { min: 35, max: 50, level: '重度障碍', color: 'danger', desc: '严重影响生活质量' }
  ],
  calculate: function(answers: any[]) {
    const score = answers.reduce((a: number, b: number) => a + b, 0);
    return { score, maxScore: 50 };
  }
};

// 故意创建一个"坏数据"来测试验证系统
const mockInvalidScale = {
  id: 'bad_scale',
  name: '不完整量表',
  category: 'test',
  // 缺少 totalScore, calculate, interpretation 等必要字段
};

const mockProtocols = [
  {
    id: 'postop_shoulder',
    name: '肩关节术后康复协议',
    type: 'postop',
    version: '1.5',
    source: '美国运动医学会 (ACSM)',
    description: '肩关节镜术后 12 周康复方案',
    indications: ['肩关节镜术后', '肩袖修复术后'],
    contraindications: ['活动性感染', '严重神经损伤'],
    phases: [
      {
        name: '急性期 (1-2周)',
        duration: '2周',
        goals: ['控制疼痛', '减少肿胀', '保护修复组织'],
        interventions: ['冷疗', '被动关节活动度训练', '肩胛稳定训练'],
        criteria: ['VAS 疼痛 < 3/10', '肩关节被动外展 > 90°']
      },
      {
        name: '亚急性期 (3-6周)',
        duration: '4周',
        goals: ['恢复关节活动度', '增强肩胛稳定'],
        interventions: ['主动辅助关节活动度', '等长收缩训练', '功能性训练'],
        criteria: ['肩关节主动外展 > 120°', '无夜间疼痛']
      }
    ]
  }
];

// ========== 初始化函数 ==========

/**
 * 初始化临床数据系统
 * 在应用启动时调用此函数
 */
export function initClinicalDataSystem() {
  console.log('╔══════════════════════════════════════════╗');
  console.log('║    临床决策支持系统 - 数据安全启动     ║');
  console.log('╚══════════════════════════════════════════╝');
  console.log('');

  // 1. 准备原始数据
  const rawScales = [mockVASScale, mockNASSScale]; // 注意：mockInvalidScale 未加入，会触发错误演示
  const rawProtocols = mockProtocols;
  
  // 2. 初始化数据服务（内部会自动验证）
  const state = initializeDataService(rawScales, rawProtocols);
  
  // 3. 获取自检报告
  const report = getSelfCheckReport();
  
  console.log('');
  console.log('════════════════════════════════════════════');
  console.log('📊 系统状态报告');
  console.log('════════════════════════════════════════════');
  
  if (report) {
    console.log(`状态: ${report.status === 'healthy' ? '✅ 健康' : report.status === 'degraded' ? '⚠️ 降级' : '❌ 异常'}`);
    console.log(`时间: ${report.timestamp}`);
    console.log('');
    
    console.log('📈 量表检查结果:');
    console.log(`  - 总数: ${report.scaleResults.summary.total}`);
    console.log(`  - 通过: ${report.scaleResults.summary.valid}`);
    console.log(`  - 失败: ${report.scaleResults.summary.invalid}`);
    console.log(`  - 警告: ${report.scaleResults.summary.warnings}`);
  }
  
  console.log('');
  
  // 4. 获取版本信息
  const versionInfo = getVersionInfo();
  if (versionInfo) {
    console.log('🏷️  数据版本信息:');
    console.log(`  量表版本: ${versionInfo.scales.versions.join(', ')}`);
    console.log(`  协议版本: ${versionInfo.protocols.versions.join(', ')}`);
    console.log(`  量表来源: ${versionInfo.scales.sources.join(', ')}`);
    console.log('');
  }
  
  // 5. 演示安全的数据访问
  const scales = getAllScales();
  const protocols = getAllProtocols();
  
  console.log('🔍 可访问的临床数据:');
  console.log(`  - 量表数量: ${scales.length}`);
  console.log(`  - 协议数量: ${protocols.length}`);
  
  if (scales.length > 0) {
    console.log('  - 第一个量表示例:');
    const firstScale = scales[0];
    console.log(`    ID: ${firstScale.id}`);
    console.log(`    名称: ${firstScale.name}`);
    console.log(`    版本: ${firstScale.version}`);
    console.log(`    来源: ${firstScale.source}`);
    console.log(`    总分: ${firstScale.totalScore}`);
    console.log(`    分级标准: ${firstScale.interpretation.length} 级`);
  }
  
  console.log('');
  console.log('✅ 临床数据系统初始化完成！');
  console.log('');
  
  return { state, report, scales, protocols };
}

// ========== 使用示例 ==========

// 如果作为主入口运行
if (typeof window !== 'undefined') {
  // 浏览器环境
  (window as any).__clinicalDataSystem = {
    init: initClinicalDataSystem,
    getAllScales,
    getAllProtocols,
    getVersionInfo,
    getSelfCheckReport
  };
  
  console.log('📚 临床数据系统已挂载到 window.__clinicalDataSystem');
  console.log('💡 使用方式: window.__clinicalDataSystem.init()');
}

// 重新导出 dataService 的 API（但不包括 initClinicalDataSystem，因为它在本文件中定义）
export {
  getAllScales,
  getAllProtocols,
  getScaleById,
  getProtocolById,
  getVersionInfo,
  getSelfCheckReport,
  initializeDataService
};
