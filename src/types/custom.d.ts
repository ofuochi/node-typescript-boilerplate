import CurrentUser from "../domain/utils/globals";
declare global {
    namespace Express {
        export interface Request {
            tenantId?: string;
        }
    }
    namespace NodeJS {
        interface Global {
            currentUser: CurrentUser;
        }
    }
}
