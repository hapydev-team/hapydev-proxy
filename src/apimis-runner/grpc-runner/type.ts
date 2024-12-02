type ConsoleType = 'log' | 'error' | 'info' | 'warn';

export type OnMethods = (data: any) => void; //获取方法列表
export type OnResponse = (data: any) => void; //返回响应数据
export type OnConsole = (action: ConsoleType, ...args: any) => void;
export type OnError = (message: string) => void;
export type OnReflectError = (message: string) => void;
export type OnVariables = (data: any) => void;
export type OnAssert = (result: boolean, message: string, description: string) => void;
export type OnMetadata = (data) => void;
export type OnMessage = (data) => void;
export type OnSent = (data) => void;
export type OnStreamEnd = (data) => void;
export type OnStreamStart = () => void;
export type OnMockRequest = (data) => void;
