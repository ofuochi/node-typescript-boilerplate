import { CurrentTenant } from "../domain/utils/currentTenant";
declare global {
    namespace Express {
        export interface Request {
            tenant?: string;
        }
    }
    namespace NodeJS {
        interface Global {
            currentTenant: CurrentTenant;
        }
    }
}
