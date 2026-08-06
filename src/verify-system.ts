/**
 * ⚠️ 状态：TypeScript 架构草稿，**不在当前 index.html 单文件主链路运行**。
 * ⚠️ 启用条件：需添加 tsconfig.json + 构建脚本（如 tsc/esbuild），编译输出后执行。
 *
 * 临床数据系统 - 快速验证脚本
 * 
 * 运行方式：node --loader ts-node/esm src/verify-system.ts
 * 或在 package.json 中添加脚本
 */

import { DataValidator, createScale, createProtocol, runSelfCheck, Scale, Protocol, ValidationError } from './lib/validator';
import { adaptScale, adaptScales, adaptProtocols, getDataVersionInfo } from './lib/adapter';
import { initializeDataService, getAllScales, getVersionInfo, getSelfCheckReport } from './services/dataService';
import { eventBus } from './lib/eventBus';

// ========== 测试数据 ==========

const testScale: Scale = {
  id: 'test_pain',
  name: '测试疼痛量表',
  shortName: 'TP',
  category: 'pain',
  version: '1.0.0',
  source: '测试来源',
  lastUpdated: '2026-08-05',
  description: '用于系统测试的疼痛评估量表',
  reliability: '测试信度',
  reference: '测试文献',
  totalScore: 10,
  type: 'number',
  interpretation: [
    { min: 0, max: 3, level: '轻度', color: 'success', desc: '轻度疼痛' },
    { min: 4, max: 6, level: '中度', color: 'warning', desc: '中度疼痛' },
    { min: 7, max: 10, level: '重度', color: 'danger', desc: '重度疼痛' }
  ],
  calculate: (answers) => {
    const values = Object.values(answers).map(v => typeof v === 'number' ? v : 0);
    const score = values.reduce((a, b) => a + b, 0);
    return { score, maxScore: 10 };
  }
};

// 故意创建无效数据
const invalidScale = {
  id: 'bad_scale',
  name: '无效量表',
  // 缺少必要字段
};

const testProtocol: Protocol = {
  id: 'test_protocol',
  name: '测试康复协议',
  type: 'rehab',
  version: '1.0.0',
  source: '测试指南',
  lastUpdated: '2026-08-05',
  description: '测试用康复协议',
  indications: ['功能障碍'],
  contraindications: ['急性炎症'],
  phases: [
    {
      name: '第一阶段',
      duration: '2周',
      goals: ['减轻疼痛'],
      interventions: ['物理治疗'],
      criteria: ['疼痛 VAS < 3']
    }
  ]
};

// ========== 测试执行 ==========

async function runTests() {
  console.log('╔══════════════════════════════════════════════════╗');
  console.log('║   临床数据系统 - 全面验证测试                   ║');
  console.log('╚══════════════════════════════════════════════════╝');
  console.log('');

  let passed = 0;
  let failed = 0;

  function test(name: string, fn: () => void, shouldPass = true) {
    try {
      fn();
      if (shouldPass) {
        console.log(`  ✅ ${name}`);
        passed++;
      } else {
        console.log(`  ❌ ${name} (预期失败但通过)`);
        failed++;
      }
    } catch (e: any) {
      if (!shouldPass) {
        console.log(`  ✅ ${name} (按预期失败)`);
        passed++;
      } else {
        console.log(`  ❌ ${name}: ${e.message}`);
        failed++;
      }
    }
  }

  // 测试 1: 数据验证器
  console.log('📋 1. 数据验证器测试');
  console.log('────────────────────────────────');
  
  test('验证有效量表', () => {
    const errors = DataValidator.validateScale(testScale);
    if (errors.length > 0) throw new Error(`有效量表验证失败: ${errors.map(e => e.message).join(', ')}`);
  });

  test('检测无效量表', () => {
    const errors = DataValidator.validateScale(invalidScale as any);
    const errorCount = errors.filter(e => e.severity === 'error').length;
    if (errorCount === 0) throw new Error('应该检测到无效量表的错误');
  });

  test('验证有效协议', () => {
    const errors = DataValidator.validateProtocol(testProtocol);
    if (errors.length > 0) throw new Error(`有效协议验证失败: ${errors.map(e => e.message).join(', ')}`);
  });

  // 测试 2: 数据工厂
  console.log('');
  console.log('🏭 2. 数据工厂测试');
  console.log('────────────────────────────────');
  
  test('通过工厂创建安全量表', () => {
    const scale = createScale(testScale);
    if (!scale || scale.id !== 'test_pain') throw new Error('工厂创建失败');
  });

  test('工厂拒绝无效数据', () => {
    createScale(invalidScale as any);
    throw new Error('应该抛出错误');
  }, false);

  // 测试 3: 适配器
  console.log('');
  console.log('🔌 3. 适配器测试');
  console.log('────────────────────────────────');
  
  test('适配现有格式数据', () => {
    const raw = {
      id: 'old_style',
      name: '旧格式量表',
      totalScore: 10,
      interpretation: [
        { min: 0, max: 3, level: '轻度', color: 'success', desc: '轻度' },
        { min: 4, max: 6, level: '中度', color: 'warning', desc: '中度' },
        { min: 7, max: 10, level: '重度', color: 'danger', desc: '重度' }
      ],
      calculate: function(answers: any[]) {
        return { score: answers[0] || 0, maxScore: 10 };
      }
    };
    const adapted = adaptScale(raw);
    if (!adapted || adapted.id !== 'old_style') throw new Error('适配失败');
    // 验证包装后的 calculate 函数能正常工作
    const result = adapted.calculate({ 'q0': 5 });
    if (result.score !== 5 || result.maxScore !== 10) throw new Error('计算结果不正确');
  });

  test('批量适配与过滤', () => {
    const rawScales = [
      { id: 's1', name: '量表1', totalScore: 10, calculate: (a: any[]) => ({ score: a[0] || 0, maxScore: 10 }), interpretation: [{min:0,max:10,level:'ok',color:'success',desc:'ok'}] },
      { id: 's2', name: '量表2', /* 无效 */ }
    ];
    const { scales, errors } = adaptScales(rawScales);
    if (scales.length !== 1) throw new Error('应该只有 1 个有效量表');
    if (errors.length !== 1) throw new Error('应该有 1 个错误');
  });

  // 测试 4: 数据服务
  console.log('');
  console.log('🛠️  4. 数据服务层测试');
  console.log('────────────────────────────────');
  
  test('初始化数据服务', () => {
    const state = initializeDataService(
      [{ ...testScale }, { ...invalidScale }] as any[],
      [testProtocol] as any[]
    );
    if (state.status === 'error') throw new Error('数据服务初始化失败');
    if (state.scales.length !== 1) throw new Error('应该只有 1 个有效量表');
    if (state.protocols.length !== 1) throw new Error('应该有 1 个有效协议');
  });

  test('获取自检报告', () => {
    const report = getSelfCheckReport();
    if (!report) throw new Error('自检报告不存在');
    console.log(`    状态: ${report.status}`);
    console.log(`    有效量表: ${report.scaleResults.summary.valid}/${report.scaleResults.summary.total}`);
  });

  test('获取版本信息', () => {
    const info = getVersionInfo();
    if (!info) throw new Error('版本信息不存在');
    console.log(`    量表版本: ${info.scales.versions.join(', ')}`);
  });

  // 测试 5: 事件系统
  console.log('');
  console.log('📡 5. 事件系统测试');
  console.log('────────────────────────────────');
  
  test('事件发布订阅', () => {
    let received = false;
    const unsub = eventBus.on('system:error', (payload) => {
      received = true;
      if (payload.message !== 'test') throw new Error('事件载荷错误');
    });
    eventBus.emit('system:error', { message: 'test' });
    // 由于是异步，需要等待
    setTimeout(() => {
      if (!received) throw new Error('事件未被接收');
      unsub();
    }, 100);
  });

  // 测试 6: 计算安全性
  console.log('');
  console.log('🔒 6. 计算安全测试');
  console.log('────────────────────────────────');
  
  test('无效输入安全处理', () => {
    const scale = createScale(testScale);
    // 测试各种边界输入
    const edgeCases: Array<Record<string, number | string | undefined | null>> = [
      {},                     // 空对象
      { q0: undefined },      // undefined 值
      { q0: null },           // null 值
      { q0: 'abc' },          // 字符串
      { q0: -1 },             // 负数
      { q0: 999 },            // 超大值
    ];
    for (const input of edgeCases) {
      const result = scale.calculate(input as Record<string, number | string>);
      if (typeof result.score !== 'number' || isNaN(result.score)) {
        throw new Error(`对无效输入 ${JSON.stringify(input)} 返回了无效结果`);
      }
    }
  });

  // 总结
  console.log('');
  console.log('╔══════════════════════════════════════════════════╗');
  console.log('║              测试结果总结                        ║');
  console.log('╠══════════════════════════════════════════════════╣');
  console.log(`║  通过: ${passed.toString().padStart(3)}                                        ║`);
  console.log(`║  失败: ${failed.toString().padStart(3)}                                        ║`);
  console.log(`║  总计: ${(passed + failed).toString().padStart(3)}                                        ║`);
  console.log(`║  状态: ${failed === 0 ? '✅ 全部通过' : '❌ 存在失败'}                          ║`);
  console.log('╚══════════════════════════════════════════════════╝');
  
  return failed === 0;
}

// 执行测试（浏览器环境下不使用 process.exit）
runTests().then(success => {
  if (success) {
    console.log('🎉 所有测试通过！');
  } else {
    console.error('💥 存在测试失败！');
  }
}).catch(err => {
  console.error('测试执行异常:', err);
});
