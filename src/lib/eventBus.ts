/**
 * 轻量级事件总线（Event Emitter）
 * 用于解耦 Services 层（数据写入）与 UI 层（状态更新）
 * 
 * 设计原则：
 * 1. 数据层只负责"写"，写完后广播事件
 * 2. UI 层（Hooks/Store）负责"订阅"事件，自动更新内存状态
 * 3. 禁止 UI 层直接读取 localStorage，必须通过订阅获取最新状态
 */

export type EventMap = {
  // 用户事件
  'user:created': { userId: string };
  'user:updated': { userId: string };
  'user:removed': { userId: string };
  
  // 患者事件
  'patient:created': { patientId: string };
  'patient:updated': { patientId: string };
  'patient:removed': { patientId: string };
  
  // 评估记录事件
  'record:created': { recordId: string };
  'record:updated': { recordId: string };
  'record:removed': { recordId: string };
  
  // 康复计划事件
  'plan:created': { planId: string };
  'plan:updated': { planId: string };
  'plan:removed': { planId: string };
  'plan:share': { planId: string };
  
  // 打卡事件
  'checkin:created': { checkinId: string };
  'checkin:updated': { checkinId: string };
  'checkin:removed': { checkinId: string };
  
  // 临床检查事件
  'exam:created': { examId: string };
  'exam:updated': { examId: string };
  'exam:removed': { examId: string };
  
  // 特殊检查事件
  'special:created': { recordId: string };
  'special:updated': { recordId: string };
  'special:removed': { recordId: string };
  
  // 会话事件
  'session:login': { userId: string };
  'session:logout': void;
  'session:expired': void;
  
  // 系统事件
  'system:reset': void;
  'system:ready': { status: string; scaleCount: number; protocolCount: number };
  'system:error': { message: string; code?: string };
};

export type EventName = keyof EventMap;
export type EventPayload<T extends EventName> = EventMap[T];

/**
 * 事件总线类
 * 使用泛型约束确保事件名与载荷类型严格匹配
 */
class EventBus {
  private listeners: Map<EventName, Set<Function>> = new Map();

  /** 订阅事件 */
  on<K extends EventName>(event: K, callback: (payload: EventPayload<K>) => void): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
    
    // 返回取消订阅的函数
    return () => {
      this.listeners.get(event)?.delete(callback);
    };
  }

  /** 触发事件 */
  emit<K extends EventName>(event: K, payload: EventPayload<K>): void {
    const listeners = this.listeners.get(event);
    if (!listeners || listeners.size === 0) return;
    
    // 使用 setTimeout 异步执行，避免阻塞调用方
    // 这也防止了监听回调中的错误影响其他监听者
    setTimeout(() => {
      listeners.forEach(cb => {
        try {
          cb(payload);
        } catch (error) {
          console.error(`[EventBus] Error in listener for "${event}":`, error);
        }
      });
    }, 0);
  }

  /** 移除某个事件的所有监听者 */
  offAll<K extends EventName>(event: K): void {
    this.listeners.delete(event);
  }

  /** 清除所有监听者（用于测试或卸载） */
  clear(): void {
    this.listeners.clear();
  }
}

// 导出单例
export const eventBus = new EventBus();
