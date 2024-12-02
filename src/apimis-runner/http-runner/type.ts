type ConsoleType = 'log' | 'error' | 'info' | 'warn';

export type OnConsole = (action: ConsoleType, ...args: any) => void;

export type OnVisualizing = (result: boolean, err: Error, data: string) => void;

export type OnAssert = (result: boolean, message: string, description: string) => void;

export type OnHttpErrpr = (message: string) => void;

export type OnResponse = (data: any, project_id?: string) => void;

export type OnVariables = (data: any) => void;
