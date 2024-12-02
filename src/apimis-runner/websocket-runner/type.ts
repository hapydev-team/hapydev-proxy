type ConsoleType = 'log' | 'error' | 'info' | 'warn';
export type EventConnectionOpen = (data: any) => void; //链接成功
export type EventConnectionError = (data: any) => void; //链接失败
export type EventConnectionClose = (data: any) => void; //链接断开
export type EventMessage = (data: any) => void;
export type EventConsole = (action: ConsoleType, ...args: any) => void;
