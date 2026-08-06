/**
 * ⚠️ 状态：TypeScript 架构草稿，**不在当前 index.html 单文件主链路运行**。
 * ⚠️ 启用条件：需添加 tsconfig.json + 构建脚本（如 tsc/esbuild），编译输出到 src/ 目录后由 index.html 引入。
 *
 * 数据服务层（Data Service Layer）
 * 
 * 职责：
 * 1. 加载和初始化所有临床数据
 * 2. 运行数据自检，确保数据完整性
 * 3. 提供类型安全的数据访问接口
 * 4. 维护数据的元信息（版本、来源）
 * 
 * 这是临床数据的"唯一真相源"（Single Source of Truth）
 */

import { Scale, Protocol, runSelfCheck, ValidationError } from '../lib/validator';
import { adaptScales, adaptProtocols, getDataVersionInfo } from '../lib/adapter';
import { eventBus } from '../lib/eventBus';
import { logger } from '../lib/logger';

// ========== 模块状态 ==========

export type DataServiceStatus = 'initializing' | 'ready' | 'degraded' | 'error';

export interface DataServiceState {
  status: DataServiceStatus;
  scales: Scale[];
  protocols: Protocol[];
  invalidScales: { scale: Scale; errors: ValidationError[] }[];
  invalidProtocols: { protocol: Protocol; errors: ValidationError[] }[];
  versionInfo: ReturnType<typeof getDataVersionInfo> | null;
  selfCheckReport: ReturnType<typeof runSelfCheck> | null;
  initializedAt: string | null;
}

let state: DataServiceState = {
  status: 'initializing',
  scales: [],
  protocols: [],
  invalidScales: [],
  invalidProtocols: [],
  versionInfo: null,
  selfCheckReport: null,
  initializedAt: null
};

const listeners = new Set<(state: DataServiceState) => void>();

// ========== 公共 API ==========

export function initializeDataService(rawScales: any[], rawProtocols: any[]): DataServiceState {
  const startTime = Date.now();
  try {
    logger.info('DataService 开始初始化');
    logger.info(`输入数据: ${rawScales.length} 个原始量表, ${rawProtocols.length} 个原始协议`);
    emitStateChange('initializing');
    
    const { scales, errors: scaleErrors } = adaptScales(rawScales);
    if (scaleErrors.length > 0) {
      logger.warn(`有 ${scaleErrors.length} 个量表适配失败`, 
        scaleErrors.map(e => `${e.id}: ${e.errors[0]?.message}`).join('; ')
      );
    }
    
    const { protocols, errors: protocolErrors } = adaptProtocols(rawProtocols);
    if (protocolErrors.length > 0) {
      logger.warn(`有 ${protocolErrors.length} 个协议适配失败`,
        protocolErrors.map(e => `${e.id}: ${e.message}`).join('; ')
      );
    }
    
    const selfCheckReport = runSelfCheck(scales, protocols);
    logger.info(`自检结果: 量表 ${selfCheckReport.scaleResults.summary.valid}/${selfCheckReport.scaleResults.summary.total} 通过, 协议 ${selfCheckReport.protocolResults.valid}/${selfCheckReport.protocolResults.total} 通过`);
    
    const versionInfo = getDataVersionInfo(scales, protocols);
    logger.info(`版本信息: 量表 ${versionInfo.scales.versions.join(', ')}, 协议 ${versionInfo.protocols.versions.join(', ')}`);
    
    const finalStatus: DataServiceStatus = selfCheckReport.status === 'healthy' ? 'ready' : 'degraded';
    state = {
      status: finalStatus,
      scales,
      protocols,
      invalidScales: selfCheckReport.scaleResults.invalid,
      invalidProtocols: [],
      versionInfo,
      selfCheckReport,
      initializedAt: new Date().toISOString()
    };
    
    const elapsed = Date.now() - startTime;
    
    logger.info(`初始化完成: ${scales.length} 个量表, ${protocols.length} 个协议 (耗时 ${elapsed}ms)`);
    logger.info(`数据状态: ${state.status}`);
    if (state.status === 'degraded') {
      logger.warn(`系统降级运行，有 ${selfCheckReport.scaleResults.invalid.length} 个量表未通过校验`);
      selfCheckReport.scaleResults.invalid.forEach(item => {
        logger.warn(`量表 [${item.scale.id}] ${item.scale.name}: ${item.errors.map(e => e.message).join('; ')}`);
      });
    }
    
    eventBus.emit('system:ready', { 
      status: state.status, 
      scaleCount: scales.length, 
      protocolCount: protocols.length 
    });
    
    emitStateChange(state.status);
    return state;
    
  } catch (error) {
    const elapsed = Date.now() - startTime;
    logger.error(`初始化失败 (耗时 ${elapsed}ms)`, error);
    state.status = 'error';
    emitStateChange('error');
    eventBus.emit('system:error', { 
      message: (error as Error).message, 
      code: 'INIT_FAILED' 
    });
    return state;
  }
}

export function getDataServiceState(): DataServiceState {
  return { ...state };
}

export function getAllScales(): Scale[] {
  return state.scales;
}

export function getScaleById(id: string): Scale | undefined {
  const scale = state.scales.find(s => s.id === id);
  if (!scale) {
    logger.debug(`getScaleById: 量表 "${id}" 未找到 (共 ${state.scales.length} 个量表)`);
  }
  return scale;
}

export function getScalesByCategory(category: string): Scale[] {
  const filtered = state.scales.filter(s => s.category === category);
  logger.info(`getScalesByCategory("${category}"): 返回 ${filtered.length}/${state.scales.length} 个量表`);
  return filtered;
}

export function getAllProtocols(): Protocol[] {
  return state.protocols;
}

export function getProtocolById(id: string): Protocol | undefined {
  const protocol = state.protocols.find(p => p.id === id);
  if (!protocol) {
    logger.debug(`getProtocolById: 协议 "${id}" 未找到 (共 ${state.protocols.length} 个协议)`);
  }
  return protocol;
}

export function getVersionInfo() {
  if (!state.versionInfo) {
    logger.warn('getVersionInfo: 版本信息不可用（数据服务可能未初始化）');
  }
  return state.versionInfo;
}

export function getSelfCheckReport() {
  return state.selfCheckReport;
}

export function subscribeDataService(callback: (state: DataServiceState) => void): () => void {
  listeners.add(callback);
  callback(state);
  
  return () => {
    listeners.delete(callback);
  };
}

// ========== 内部工具 ==========

function emitStateChange(status: DataServiceStatus): void {
  listeners.forEach(cb => {
    try {
      cb(state);
    } catch (e) {
      logger.error('监听器错误:', e);
    }
  });
}

// ========== React Hook 支持 ==========

export function useDataService() {
  return state;
}

export function useScales(category?: string) {
  if (category) {
    return state.scales.filter(s => s.category === category);
  }
  return state.scales;
}

export function useProtocols(type?: string) {
  if (type) {
    return state.protocols.filter(p => p.type === type);
  }
  return state.protocols;
}
