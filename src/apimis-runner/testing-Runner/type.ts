type ConsoleType = 'log' | 'error' | 'info' | 'warn';
export type EventStart = (data: any) => void; //准备开始执行任务
export type EventRunning = (data: any) => void; //执行步骤返回事件
export type EventDone = (data: any) => void; //执行步骤返回事件
export type EventProgress = (data: any) => void; //执行步骤返回事件
export type EventComplete = (data: any) => void; //执行完成返回事件
export type EventCancel = (data: any) => void; //执行取消返回事件
export type EventError = (data: any) => void; //执行失败返回事件
export type EventConsole = (action: ConsoleType, ...args: any) => void; //控制台事件
