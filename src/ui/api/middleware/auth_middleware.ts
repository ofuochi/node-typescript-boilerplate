import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { Container } from "inversify";
import jwt from "jsonwebtoken";
import { TYPES } from "../../../domain/constants/types";
import {
    ITenantRepository,
    IUserRepository
} from "../../../domain/interfaces/repositories";
import { UserRole } from "../../../domain/model/user";
import { CurrentUser } from "../../../domain/utils/globals";
import { config as env } from "../../../infrastructure/config";
import { iocContainer } from "../../../infrastructure/config/ioc";
import { TenantRepository } from "../../../infrastructure/db/repositories/tenant_repository";
import { isIdValid } from "../../../infrastructure/utils/server_utils";
import {
    X_AUTH_TOKEN_KEY,
    X_TENANT_ID
} from "../../constants/header_constants";
import { HttpError } from "../../error";
import { DecodedJwt } from "../../services/auth_service";

function authMiddlewareFactory(iocContainer: Container) {
    return (config: { role: UserRole }) => {
        return (req: Request, res: Response, next: NextFunction) => {
            const accountRepository = iocContainer.get<IUserRepository>(
                TYPES.UserRepository
            );

            (async () => {
                const token = req.header("X-AUTH-TOKEN");
                if (!token)
                    return next(
                        new HttpError(
                            httpStatus.BAD_REQUEST,
                            "Auth token is required!"
                        )
                    );

                try {
                    const decodedJwt = jwt.verify(
                        token,
                        env.jwtSecret
                    ) as DecodedJwt;

                    const userRecord = await accountRepository.findOneByQuery({
                        email: decodedJwt.email
                    });

                    return userRecord && userRecord.role === config.role
                        ? next()
                        : res.status(httpStatus.FORBIDDEN).end("Forbidden");
                } catch (error) {
                    return next(new HttpError(httpStatus.UNAUTHORIZED, error));
                }
            })();
        };
    };
}

function authentication(iocContainer: Container) {
    return async (
        req: Request,
        securityName: string,
        scopes: string[] = ["user"]
    ): Promise<any> => {
        if (
            securityName.toLowerCase() !== X_AUTH_TOKEN_KEY.toLowerCase() &&
            securityName.toLowerCase() !== X_TENANT_ID.toLowerCase()
        )
            throw new Error("Invalid security name");

        switch (securityName.toLowerCase()) {
            case X_AUTH_TOKEN_KEY.toLowerCase(): {
                const tenantId = req.headers[
                    X_TENANT_ID.toLowerCase()
                ] as string;
                const token = req.headers[
                    X_AUTH_TOKEN_KEY.toLowerCase()
                ] as string;
                await assignTenantToReqAsync(tenantId, req);
                if (!token)
                    throw new HttpError(
                        httpStatus.UNAUTHORIZED,
                        `Missing ${X_AUTH_TOKEN_KEY} token!`
                    );
                await assignJwtAsync(token, scopes, iocContainer);
                return token;
            }
            case X_TENANT_ID.toLowerCase(): {
                const tenantId = req.headers[
                    X_TENANT_ID.toLowerCase()
                ] as string;

                await assignTenantToReqAsync(tenantId, req);
                return tenantId;
            }
            default:
                throw new HttpError(httpStatus.UNAUTHORIZED);
        }
    };
}

async function assignJwtAsync(
    token: string,
    scopes: string[],
    iocContainer: Container
) {
    try {
        const decodedJwt = jwt.verify(token, env.jwtSecret) as DecodedJwt;
        const userRole = (UserRole as any)[scopes[0].toUpperCase()];
        if (userRole !== UserRole.USER && !decodedJwt.role === userRole)
            throw new HttpError(httpStatus.FORBIDDEN, "Access denied!");
        const tenantRepository = iocContainer.get<ITenantRepository>(
            TenantRepository
        );
        const tenant = await tenantRepository.findById(decodedJwt.tenantId);

        if (!tenant || !tenant.isActive)
            throw new HttpError(
                httpStatus.FORBIDDEN,
                "Tenant is not available!"
            );
        global.currentUser.setUserDetails(decodedJwt);
    } catch (error) {
        throw new HttpError(httpStatus.BAD_REQUEST, error);
    }
}
async function assignTenantToReqAsync(tenantId: string, req: Request) {
    if (!isIdValid(tenantId))
        throw new HttpError(
            httpStatus.BAD_REQUEST,
            `${tenantId} is not a valid ${X_TENANT_ID} header`
        );
    const tenantRepo = iocContainer.get<ITenantRepository>(
        TYPES.TenantRepository
    );
    const tenant = await tenantRepo.findById(tenantId);
    if (!tenant)
        throw new HttpError(
            httpStatus.BAD_REQUEST,
            `Tenant ID ${tenantId} is unavailable`
        );
    global.currentUser = CurrentUser.createInstance(tenant);
    req.tenantId = tenantId;
}
export const expressAuthentication = authentication(iocContainer);
export const authMiddleware = authMiddlewareFactory(iocContainer);
