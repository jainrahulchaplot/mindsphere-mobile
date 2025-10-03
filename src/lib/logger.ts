/**
 * Structured logging utility
 * All logs are JSON formatted for easy parsing
 */

export interface LogEntry {
  event: string;
  ts: string;
  level: 'info' | 'warn' | 'error';
  meta?: Record<string, any>;
}

function createLogEntry(
  event: string, 
  level: 'info' | 'warn' | 'error', 
  meta?: Record<string, any>
): LogEntry {
  return {
    event,
    ts: new Date().toISOString(),
    level,
    meta
  };
}

export function logInfo(event: string, meta?: Record<string, any>): void {
  const entry = createLogEntry(event, 'info', meta);
  console.log(JSON.stringify(entry));
}

export function logWarn(event: string, meta?: Record<string, any>): void {
  const entry = createLogEntry(event, 'warn', meta);
  console.warn(JSON.stringify(entry));
}

export function logError(event: string, meta?: Record<string, any>): void {
  const entry = createLogEntry(event, 'error', meta);
  console.error(JSON.stringify(entry));
}
