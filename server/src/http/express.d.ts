declare module "express" {
  import type { Server } from "node:http";

  export interface Request {
    header(name: string): string | undefined;
    accepts(type: string): string | false;
  }

  export interface Response {
    locals: Record<string, unknown>;
    headersSent: boolean;
    status(code: number): this;
    json(body: unknown): this;
    setHeader(name: string, value: string): void;
    sendFile(path: string, options: { root: string }, callback: (error?: Error) => void): void;
  }

  export type NextFunction = (error?: unknown) => void;
  export type RequestHandler = (request: Request, response: Response, next: NextFunction) => void;
  export type ErrorRequestHandler = (error: any, request: Request, response: Response, next: NextFunction) => void;

  interface Application {
    (request: unknown, response: unknown): void;
    disable(name: string): this;
    use(handler: RequestHandler | ErrorRequestHandler): this;
    get(path: string | RegExp, handler: RequestHandler): this;
    listen(port: number, host: string, callback?: () => void): Server;
  }

  interface ExpressFactory {
    (): Application;
    json(options: { limit: string }): RequestHandler;
    static(directory: string, options?: { extensions?: string[] }): RequestHandler;
  }

  const express: ExpressFactory;
  export default express;
}
