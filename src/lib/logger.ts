/**
 * 临床数据系统日志器
 * 
 * 支持日志级别控制，生产模式下仅输出 warn/error。
 * 
 * 级别：
 *   debug  - 详细调试信息（仅开发环境）
 *   info   - 常规运行信息（仅开发环境）
 *   warn   - 警告信息（生产环境保留）
 *   error  - 错误信息（生产环境保留）
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
};

/** 生产环境默认级别：仅输出 warn/error */
let currentLevel: LogLevel = 
  (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'prod') 
    ? 'warn' 
    : 'debug';

/**
 * 动态设置日志级别
 * @example setLogLevel('warn') // 生产模式
 * @example setLogLevel('debug') // 开发模式
 */
export function setLogLevel(level: LogLevel): void {
  currentLevel = level;
}

/**
 * 获取当前日志级别
 */
export function getLogLevel(): LogLevel {
  return currentLevel;
}

export const logger = {
  debug(...args: any[]): void {
    if (LOG_LEVELS.debug >= LOG_LEVELS[currentLevel]) {
      console.debug('[ClinicalData][DEBUG]', ...args);
    }
  },

  info(...args: any[]): void {
    if (LOG_LEVELS.info >= LOG_LEVELS[currentLevel]) {
      console.log('[ClinicalData][INFO]', ...args);
    }
  },

  warn(...args: any[]): void {
    if (LOG_LEVELS.warn >= LOG_LEVELS[currentLevel]) {
      console.warn('[ClinicalData][WARN]', ...args);
    }
  },

  error(...args: any[]): void {
    if (LOG_LEVELS.error >= LOG_LEVELS[currentLevel]) {
      console.error('[ClinicalData][ERROR]', ...args);
    }
  }
};
