/**
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

// ========== 模块状态 ==========

/** 服务状态 */
export type DataServiceStatus = 'initializing' | 'ready' | 'degraded' | 'error';

/** 数据服务接口 */
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

// 模块级单例状态
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

// 事件监听者
const listeners = new Set<(state: DataServiceState) => void>();

// ========== 公共 API ==========

/**
 * 初始化数据服务
 * @param rawScales 原始量表数据（来自 scales.js 等）
 * @param rawProtocols 原始协议数据（来自 protocols-*.js 等）
 */
export function initializeDataService(rawScales: any[], rawProtocols: any[]): DataServiceState {
  const startTime = Date.now();
  try {
    console.log('🚀 [DataService] 开始初始化...');
    console.log(`📥 [DataService] 输入数据: ${rawScales.length} 个原始量表, ${rawProtocols.length} 个原始协议`);
    emitStateChange('initializing');
    
    // 1. 适配数据（运行时校验）
    console.log('📊 [DataService] 适配量表数据...');
    const { scales, errors: scaleErrors } = adaptScales(rawScales);
    if (scaleErrors.length > 0) {
      console.warn(`⚠️ [DataService] 有 ${scaleErrors.length} 个量表适配失败:`, 
        scaleErrors.map(e => `${e.id}: ${e.errors[0]?.message}`).join('; ')
      );
    }
    
    console.log('📋 [DataService] 适配协议数据...');
    const { protocols, errors: protocolErrors } = adaptProtocols(rawProtocols);
    if (protocolErrors.length > 0) {
      console.warn(`⚠️ [DataService] 有 ${protocolErrors.length} 个协议适配失败:`,
        protocolErrors.map(e => `${e.id}: ${e.message}`).join('; ')
      );
    }
    
    // 2. 运行自检
    console.log('🔍 [DataService] 运行数据自检...');
    const selfCheckReport = runSelfCheck(scales, protocols);
    console.log(`📊 [DataService] 自检结果: 量表 ${selfCheckReport.scaleResults.summary.valid}/${selfCheckReport.scaleResults.summary.total} 通过, 协议 ${selfCheckReport.protocolResults.valid}/${selfCheckReport.protocolResults.total} 通过`);
    
    // 3. 生成版本信息
    const versionInfo = getDataVersionInfo(scales, protocols);
    console.log(`🏷️ [DataService] 版本信息: 量表 ${versionInfo.scales.versions.join(', ')}, 协议 ${versionInfo.protocols.versions.join(', ')}`);
    
    // 4. 更新状态
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
    
    // 5. 记录结果
    console.log(`✅ [DataService] 初始化完成: ${scales.length} 个量表, ${protocols.length} 个协议 (耗时 ${elapsed}ms)`);
    console.log(`📈 [DataService] 数据状态: ${state.status}`);
    if (state.status === 'degraded') {
      console.warn(`⚠️ [DataService] 系统降级运行，有 ${selfCheckReport.scaleResults.invalid.length} 个量表未通过校验`);
      selfCheckReport.scaleResults.invalid.forEach(item => {
        console.warn(`   - 量表 [${item.scale.id}] ${item.scale.name}: ${item.errors.map(e => e.message).join('; ')}`);
      });
    }
    
    // 6. 广播就绪事件
    eventBus.emit('system:ready', { 
      status: state.status, 
      scaleCount: scales.length, 
      protocolCount: protocols.length 
    });
    
    emitStateChange(state.status);
    return state;
    
  } catch (error) {
    const elapsed = Date.now() - startTime;
    console.error(`❌ [DataService] 初始化失败 (耗时 ${elapsed}ms):`, error);
    state.status = 'error';
    emitStateChange('error');
    eventBus.emit('system:error', { 
      message: (error as Error).message, 
      code: 'INIT_FAILED' 
    });
    return state;
  }
}

/**
 * 获取当前状态
 */
export function getDataServiceState(): DataServiceState {
  return { ...state };
}

/**
 * 获取所有量表
 */
export function getAllScales(): Scale[] {
  return state.scales;
}

/**
 * 按 ID 获取量表
 */
export function getScaleById(id: string): Scale | undefined {
  const scale = state.scales.find(s => s.id === id);
  if (!scale) {
    console.debug(`[DataService] getScaleById: 量表 "${id}" 未找到 (共 ${state.scales.length} 个量表)`);
  }
  return scale;
}

/**
 * 按类别获取量表
 */
export function getScalesByCategory(category: string): Scale[] {
  const filtered = state.scales.filter(s => s.category === category);
  console.log(`[DataService] getScalesByCategory("${category}"): 返回 ${filtered.length}/${state.scales.length} 个量表`);
  return filtered;
}

/**
 * 获取所有协议
 */
export function getAllProtocols(): Protocol[] {
  return state.protocols;
}

/**
 * 按 ID 获取协议
 */
export function getProtocolById(id: string): Protocol | undefined {
  const protocol = state.protocols.find(p => p.id === id);
  if (!protocol) {
    console.debug(`[DataService] getProtocolById: 协议 "${id}" 未找到 (共 ${state.protocols.length} 个协议)`);
  }
  return protocol;
}

/**
 * 获取版本信息
 */
export function getVersionInfo() {
  if (!state.versionInfo) {
    console.warn('[DataService] getVersionInfo: 版本信息不可用（数据服务可能未初始化）');
  }
  return state.versionInfo;
}

/**
 * 获取自检报告
 */
export function getSelfCheckReport() {
  return state.selfCheckReport;
}

/**
 * 订阅状态变更（React Hook 可用）
 */
export function subscribeDataService(callback: (state: DataServiceState) => void): () => void {
  listeners.add(callback);
  callback(state); // 立即回调一次当前状态
  
  // 返回取消订阅函数
  return () => {
    listeners.delete(callback);
  };
}

// ========== 内部工具 ==========

/** 广播状态变更 */
function emitStateChange(status: DataServiceStatus): void {
  listeners.forEach(cb => {
    try {
      cb(state);
    } catch (e) {
      console.error('[DataService] 监听器错误:', e);
    }
  });
}

// ========== React Hook 支持 ==========
// 注意：这是一个轻量级实现，生产环境建议使用 Zustand 或其他状态管理库

/**
 * React Hook: 使用数据服务
 * @example
 * const { status, scales, error } = useDataService();
 */
export function useDataService() {
  // 这个函数在 React 组件中应被包装为 Hook
  // 这里仅作为接口定义，实际 Hook 需要通过 React.createContext 或外部 store 实现
  return state;
}

/**
 * React Hook: 使用量表列表
 */
export function useScales(category?: string) {
  if (category) {
    return state.scales.filter(s => s.category === category);
  }
  return state.scales;
}

/**
 * React Hook: 使用协议列表
 */
export function useProtocols(type?: string) {
  if (type) {
    return state.protocols.filter(p => p.type === type);
  }
  return state.protocols;
}
