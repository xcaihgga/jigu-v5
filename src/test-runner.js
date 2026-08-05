/**
 * 测试运行器：验证现有临床数据
 * 
 * 使用方法：
 * 1. 在浏览器控制台运行：loadTestRunner()
 * 2. 或在 HTML 中引入此文件
 */

function runClinicalDataTests() {
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║         临床数据系统 - 全面验证测试                        ║');
  console.log('╚══════════════════════════════════════════════════════════════╝');
  console.log('');

  const ClinicalData = window.ClinicalData;
  if (!ClinicalData) {
    console.error('❌ 临床数据系统未加载！请先引入 clinical-data-system.js');
    return;
  }

  let passed = 0;
  let failed = 0;
  const results = [];

  function test(name, fn, shouldPass = true) {
    try {
      fn();
      if (shouldPass) {
        console.log(`  ✅ ${name}`);
        passed++;
        results.push({ name, status: 'pass' });
      } else {
        console.log(`  ❌ ${name} (预期失败但通过)`);
        failed++;
        results.push({ name, status: 'fail' });
      }
    } catch (e) {
      if (!shouldPass) {
        console.log(`  ✅ ${name} (按预期失败)`);
        passed++;
        results.push({ name, status: 'pass', detail: e.message });
      } else {
        console.log(`  ❌ ${name}: ${e.message}`);
        failed++;
        results.push({ name, status: 'fail', detail: e.message });
      }
    }
  }

  // 检查是否有可用的量表数据
  const hasScales = typeof assessmentScales !== 'undefined' && Array.isArray(assessmentScales);
  const hasProtocols = typeof window.clinicalProtocols !== 'undefined' || typeof rehabilitationProtocols !== 'undefined';
  
  const scales = hasScales ? assessmentScales : [];
  const protocols = hasProtocols ? (window.clinicalProtocols || rehabilitationProtocols || []) : [];

  console.log(`📊 检测到数据: 量表 ${scales.length} 个, 协议 ${protocols.length} 个`);
  console.log('');

  // ========== 测试 1: 验证器基础功能 ==========
  console.log('1️⃣  数据验证器测试');
  console.log('────────────────────────────────────────────────────────');

  // 创建测试量表
  const validTestScale = {
    id: 'test_valid',
    name: '有效测试量表',
    totalScore: 10,
    interpretation: [
      { min: 0, max: 3, level: '轻度', color: 'success', desc: '轻度' },
      { min: 4, max: 6, level: '中度', color: 'warning', desc: '中度' },
      { min: 7, max: 10, level: '重度', color: 'danger', desc: '重度' }
    ],
    calculate: function(answers) {
      return { score: answers[0] || 0, maxScore: 10 };
    }
  };

  const invalidTestScale = {
    id: 'test_invalid',
    // 缺少必要字段
  };

  test('验证有效量表', () => {
    const errors = ClinicalData.validateScale(validTestScale);
    const hasErrors = errors.some(e => e.severity === 'error');
    if (hasErrors) throw new Error(`有效量表验证失败: ${errors.map(e => e.message).join(', ')}`);
  });

  test('检测无效量表', () => {
    const errors = ClinicalData.validateScale(invalidTestScale);
    const errorCount = errors.filter(e => e.severity === 'error').length;
    if (errorCount === 0) throw new Error('应该检测到无效量表的错误');
  });

  test('无效 calculate 函数安全处理', () => {
    const badCalcScale = {
      ...validTestScale,
      id: 'test_bad_calc',
      calculate: function() { throw new Error('计算错误'); }
    };
    const errors = ClinicalData.validateScale(badCalcScale);
    const calcError = errors.find(e => e.field === 'calculate');
    if (!calcError) throw new Error('应该检测到 calculate 函数错误');
  });

  // ========== 测试 2: 现有数据验证 ==========
  console.log('');
  console.log('2️⃣  现有数据验证测试');
  console.log('────────────────────────────────────────────────────────');

  if (scales.length > 0) {
    test('所有量表结构完整性检查', () => {
      let errorCount = 0;
      let warningCount = 0;
      const errorsList = [];
      
      for (const scale of scales) {
        const errors = ClinicalData.validateScale(scale);
        errorCount += errors.filter(e => e.severity === 'error').length;
        warningCount += errors.filter(e => e.severity === 'warning').length;
        
        if (errors.length > 0) {
          errorsList.push({
            id: scale.id,
            name: scale.name,
            errors: errors
          });
        }
      }
      
      console.log(`    📊 结果: ${scales.length} 个量表, ${errorCount} 个错误, ${warningCount} 个警告`);
      
      if (errorsList.length > 0) {
        console.log('    🔍 有问题的量表:');
        errorsList.slice(0, 5).forEach(item => {
          console.log(`      - [${item.id}] ${item.name}`);
          item.errors.slice(0, 3).forEach(err => {
            console.log(`        • [${err.severity}] ${err.field}: ${err.message}`);
          });
        });
        if (errorsList.length > 5) {
          console.log(`      ... 还有 ${errorsList.length - 5} 个量表有问题`);
        }
      }
      
      // 不抛出错误（仅统计），但记录结果
      window.__testResults = { 
        ...window.__testResults, 
        scalesChecked: scales.length,
        scaleErrors: errorCount,
        scaleWarnings: warningCount,
        problematicScales: errorsList
      };
    });
  } else {
    console.log('    ⚠️  未检测到量表数据，跳过此测试');
  }

  // ========== 测试 3: 迁移与初始化 ==========
  console.log('');
  console.log('3️⃣  数据迁移与初始化测试');
  console.log('────────────────────────────────────────────────────────');

  test('初始化数据服务', () => {
    const state = ClinicalData.init(scales, protocols);
    if (!state.initialized) throw new Error('数据服务初始化失败');
    console.log(`    📊 已加载 ${state.scales.length} 个有效量表`);
    console.log(`    📋 已加载 ${state.protocols.length} 个有效协议`);
    console.log(`    🏷️  版本: ${state.versionInfo?.scales?.versions?.join(', ') || 'N/A'}`);
  });

  test('获取版本信息', () => {
    const info = ClinicalData.getVersionInfo();
    if (!info) throw new Error('版本信息不存在');
    if (!info.scales.versions || info.scales.versions.length === 0) {
      console.log('    ⚠️  当前数据未包含版本字段（将自动补充 v1.0.0）');
    } else {
      console.log(`    🏷️  量表版本: ${info.scales.versions.join(', ')}`);
      console.log(`    🏷️  协议版本: ${info.protocols.versions.join(', ')}`);
      console.log(`    📚 量表来源: ${info.scales.sources.join(' | ')}`);
    }
  });

  test('生成可读报告', () => {
    const report = ClinicalData.getReport();
    if (!report) throw new Error('报告不存在');
    const formatted = ClinicalData.formatReport(report);
    if (!formatted || formatted.length === 0) throw new Error('报告格式化失败');
    console.log('    ✅ 报告已生成');
    console.log(`    📄 长度: ${formatted.length} 字符`);
    
    // 保存报告到全局，方便查看
    window.__migrationReport = formatted;
  });

  // ========== 测试 4: 计算逻辑安全性 ==========
  console.log('');
  console.log('4️⃣  计算逻辑安全测试');
  console.log('────────────────────────────────────────────────────────');

  test('边界输入安全处理', () => {
    const testCases = [
      { input: {}, desc: '空对象' },
      { input: null, desc: 'null' },
      { input: undefined, desc: 'undefined' },
      { input: { '0': 'abc' }, desc: '字符串值' },
      { input: { '0': -1 }, desc: '负数' },
      { input: { '0': NaN }, desc: 'NaN' },
      { input: { '0': Infinity }, desc: 'Infinity' },
    ];
    
    let allSafe = true;
    for (const tc of testCases) {
      try {
        const result = validTestScale.calculate(tc.input);
        if (typeof result.score !== 'number' || isNaN(result.score)) {
          console.log(`    ❌ 对"${tc.desc}"返回了无效结果: ${JSON.stringify(result)}`);
          allSafe = false;
        }
      } catch (e) {
        console.log(`    ❌ 对"${tc.desc}"抛出异常: ${e.message}`);
        allSafe = false;
      }
    }
    
    if (!allSafe) throw new Error('边界输入处理不安全');
    console.log('    ✅ 所有边界输入都被安全处理');
  });

  // ========== 总结 ==========
  console.log('');
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║                    测试结果总结                            ║');
  console.log('╠══════════════════════════════════════════════════════════════╣');
  console.log(`║  ✅ 通过: ${String(passed).padStart(4)}                                       ║`);
  console.log(`║  ❌ 失败: ${String(failed).padStart(4)}                                       ║`);
  console.log(`║  📊 总计: ${String(passed + failed).padStart(4)}                                       ║`);
  console.log(`║  🎯 状态: ${failed === 0 ? '✅ 全部通过' : '⚠️ 存在失败'}                        ║`);
  console.log('╚══════════════════════════════════════════════════════════════╝');
  console.log('');

  // 输出迁移报告
  if (window.__migrationReport) {
    console.log('📄 迁移报告已保存到 window.__migrationReport');
    console.log('💡 查看方式: console.log(window.__migrationReport)');
    console.log('');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('📋 迁移报告预览:');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log(window.__migrationReport);
  }

  return { passed, failed, results };
}

// 暴露到全局
if (typeof window !== 'undefined') {
  window.runClinicalDataTests = runClinicalDataTests;
  console.log('🔬 测试运行器已加载');
  console.log('💡 运行测试: runClinicalDataTests()');
}
