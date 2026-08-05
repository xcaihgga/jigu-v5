/**
 * 数据迁移脚本
 * 
 * 将旧格式的 scales.js 和 protocols-pro.js 数据
 * 通过 adapter.ts 迁移到新架构，并生成迁移报告。
 * 
 * 运行：bun run src/migrate-data.ts
 */

// ========== 1. 加载旧格式数据（通过 require 方式加载 .js 文件） ==========

// 使用 Bun 的内置模块机制加载 JS 文件
// 需要把 .js 文件里的全局 const 暴露出来
import { adaptScale, adaptScales, adaptProtocols, getDataVersionInfo } from './lib/adapter';
import { DataValidator, runSelfCheck } from './lib/validator';
import { initializeDataService, getAllScales, getAllProtocols, getVersionInfo, getSelfCheckReport } from './services/dataService';

// 动态加载旧数据源
import * as fs from 'fs';
import * as path from 'path';

function loadJSModule(filePath: string, varName: string): any[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  // 把 const xxx = [...] 替换为 module.exports = [...]
  // 或者用 eval 的方式：直接使用一个沙箱运行
  const wrapper = `
    "use strict";
    const module = { exports: {} };
    const exports = module.exports;
    ${content.replace(/const\s+\w+\s*=\s*\[/, `const ${varName} = [`)}
    ;
    module.exports = ${varName};
    module.exports;
  `;
  // eslint-disable-next-line @typescript-eslint/no-implied-eval
  const result = eval(wrapper);
  return result;
}

function loadScales(): any[] {
  try {
    const filePath = path.join(import.meta.dir, 'scales.js');
    return loadJSModule(filePath, 'assessmentScales');
  } catch (e) {
    console.error('加载 scales.js 失败:', e);
    return [];
  }
}

function loadProtocols(): any[] {
  try {
    const filePath = path.join(import.meta.dir, 'protocols-pro.js');
    return loadJSModule(filePath, 'protocolsPro');
  } catch (e) {
    console.error('加载 protocols-pro.js 失败:', e);
    return [];
  }
}

// ========== 2. 运行迁移 ==========

async function runMigration() {
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║         临床数据迁移报告 - Migration Report                 ║');
  console.log('╚══════════════════════════════════════════════════════════════╝');
  console.log('');

  // 2.1 加载原始数据
  const rawScales = loadScales();
  const rawProtocols = loadProtocols();

  console.log(`📦 已加载原始数据: 量表 ${rawScales.length} 个, 协议 ${rawProtocols.length} 个`);
  console.log('');

  // 2.2 迁移量表
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📋 第一部分：量表迁移（Scales Migration）');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');

  const { scales: migratedScales, errors: scaleErrors } = adaptScales(rawScales);

  console.log('');
  console.log(`✅ 成功迁移量表: ${migratedScales.length}`);
  console.log(`❌ 迁移失败量表: ${scaleErrors.length}`);

  if (scaleErrors.length > 0) {
    console.log('');
    console.log('失败详情:');
    for (const err of scaleErrors) {
      console.log(`  - [${err.id}] ${err.name}`);
      for (const e of err.errors) {
        console.log(`    • [${e.severity}] ${e.field}: ${e.message}`);
      }
    }
  }

  // 2.3 迁移协议
  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📋 第二部分：协议迁移（Protocols Migration）');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');

  const { protocols: migratedProtocols, errors: protocolErrors } = adaptProtocols(rawProtocols);

  console.log('');
  console.log(`✅ 成功迁移协议: ${migratedProtocols.length}`);
  console.log(`❌ 迁移失败协议: ${protocolErrors.length}`);

  if (protocolErrors.length > 0) {
    console.log('');
    console.log('失败详情:');
    for (const err of protocolErrors) {
      console.log(`  - [${err.id}] ${err.name}: ${err.message}`);
    }
  }

  // 2.4 运行数据自检
  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔍 第三部分：数据自检（Self-Check）');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');

  const selfCheck = runSelfCheck(migratedScales, migratedProtocols);
  console.log('');

  // 2.5 初始化数据服务
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🛠️  第四部分：数据服务初始化（Data Service Init）');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');

  const state = initializeDataService(rawScales, rawProtocols);

  // 2.6 版本信息
  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🏷️  第五部分：版本与来源（Version & Source）');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');

  const versionInfo = getVersionInfo();
  if (versionInfo) {
    console.log(`量表数量: ${versionInfo.scales.count}`);
    console.log(`协议数量: ${versionInfo.protocols.count}`);
    console.log(`量表版本: ${versionInfo.scales.versions.join(', ') || 'N/A'}`);
    console.log(`协议版本: ${versionInfo.protocols.versions.join(', ') || 'N/A'}`);
    console.log('');
    console.log('量表来源:');
    versionInfo.scales.sources.forEach(s => console.log(`  • ${s}`));
    console.log('');
    console.log('协议来源:');
    versionInfo.protocols.sources.forEach(s => console.log(`  • ${s}`));
  }

  // 2.7 计算逻辑抽样检查
  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔒 第六部分：计算逻辑抽样校验（Calculation Spot-Check）');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');

  const spotCheckIds = ['vas', 'nrs', 'p4', 'odi', 'joa-lumbar', 'dash'];
  let calcPassed = 0;
  let calcFailed = 0;
  
  for (const id of spotCheckIds) {
    const scale = migratedScales.find(s => s.id === id);
    if (!scale) {
      console.log(`  ⚠️  量表 ${id} 未迁移成功，跳过`);
      continue;
    }

    try {
      // 根据量表类型生成测试数据
      let testAnswers: Record<string, number | string> = {};
      if (scale.questions && scale.questions.length > 0) {
        for (const q of scale.questions) {
          if (q.options && q.options.length > 0) {
            const scores = (q as any).scores;
            if (scores && scores.length > 0) {
              testAnswers[q.id || ''] = scores[0] || 0;
            } else {
              testAnswers[q.id || ''] = 0;
            }
          } else if (q.min !== undefined && q.max !== undefined) {
            testAnswers[q.id || ''] = (q.min + q.max) / 2;
          }
        }
      } else {
        // 单维度量表（VAS/NRS）
        testAnswers = { q0: 5, '0': 5 };
      }

      // 确保非空
      if (Object.keys(testAnswers).length === 0) {
        testAnswers = { q0: 0 };
      }

      const result = scale.calculate(testAnswers);
      const scoreOk = typeof result.score === 'number' && !isNaN(result.score);
      const maxOk = typeof result.maxScore === 'number' && !isNaN(result.maxScore);
      
      if (scoreOk && maxOk) {
        console.log(`  ✅ [${scale.id}] 计算正常: score=${result.score}, max=${result.maxScore}`);
        calcPassed++;
      } else {
        console.log(`  ❌ [${scale.id}] 计算异常: ${JSON.stringify(result)}`);
        calcFailed++;
      }
    } catch (e) {
      console.log(`  ❌ [${scale.id}] 计算抛出异常: ${(e as Error).message}`);
      calcFailed++;
    }
  }

  // 2.8 总结
  console.log('');
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║                    迁移报告总结                            ║');
  console.log('╠══════════════════════════════════════════════════════════════╣');
  console.log(`║  原始量表: ${String(rawScales.length).padStart(4)}                                           ║`);
  console.log(`║  迁移量表: ${String(migratedScales.length).padStart(4)}                                           ║`);
  console.log(`║  失败量表: ${String(scaleErrors.length).padStart(4)}                                           ║`);
  console.log(`║  原始协议: ${String(rawProtocols.length).padStart(4)}                                           ║`);
  console.log(`║  迁移协议: ${String(migratedProtocols.length).padStart(4)}                                           ║`);
  console.log(`║  失败协议: ${String(protocolErrors.length).padStart(4)}                                           ║`);
  console.log(`║  计算抽检: ${calcPassed}/${calcPassed + calcFailed}                                        ║`);
  console.log(`║  系统状态: ${selfCheck.status.padEnd(8)}                                   ║`);
  console.log('╚══════════════════════════════════════════════════════════════╝');
  console.log('');

  // 2.9 保存迁移报告到 JSON 文件
  const reportData = {
    generatedAt: new Date().toISOString(),
    systemStatus: selfCheck.status,
    scales: {
      total: rawScales.length,
      migrated: migratedScales.length,
      failed: scaleErrors.length,
      errors: scaleErrors.map(e => ({
        id: e.id,
        name: e.name,
        errors: e.errors.map(err => ({ field: err.field, message: err.message, severity: err.severity }))
      })),
      versions: versionInfo?.scales.versions || [],
      sources: versionInfo?.scales.sources || []
    },
    protocols: {
      total: rawProtocols.length,
      migrated: migratedProtocols.length,
      failed: protocolErrors.length,
      errors: protocolErrors.map(e => ({ id: e.id, name: e.name, message: e.message })),
      versions: versionInfo?.protocols.versions || [],
      sources: versionInfo?.protocols.sources || []
    },
    calculationSpotCheck: { passed: calcPassed, failed: calcFailed },
    selfCheck: {
      scaleValid: selfCheck.scaleResults.summary.valid,
      scaleInvalid: selfCheck.scaleResults.summary.invalid,
      warnings: selfCheck.scaleResults.summary.warnings,
      protocolValid: selfCheck.protocolResults.valid,
      protocolInvalid: selfCheck.protocolResults.invalid
    }
  };

  const reportPath = path.join(import.meta.dir, 'migration-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(reportData, null, 2));
  console.log(`📄 迁移报告已保存: src/migration-report.json`);

  return reportData;
}

runMigration().catch(err => {
  console.error('迁移脚本执行异常:', err);
  process.exit(1);
});
