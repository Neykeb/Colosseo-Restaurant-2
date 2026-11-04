declare module "express" {
  export interface Request {
    header(name: string): string | undefined;
  }

  export interface Response {
    locals: Record<string, unknown>;
    headersSent: boolean;
    status(code: number): this;
    json(body: unknown): this;
    setHeader(name: string, value: string): void;
  }

  export type NextFunction = (error?: unknown) => void;
  export type RequestHandler = (request: Request, response: Response, next: NextFunction) => void;
  export type ErrorRequestHandler = (error: any, request: Request, response: Response, next: NextFunction) => void;

  interface Application {
    (request: unknown, response: unknown): void;
    disable(name: string): this;
    use(handler: RequestHandler | ErrorRequestHandler): this;
    get(path: string, handler: RequestHandler): this;
  }

  interface ExpressFactory {
    (): Application;
    json(options: { limit: string }): RequestHandler;
  }

  const express: ExpressFactory;
  export default express;
}
