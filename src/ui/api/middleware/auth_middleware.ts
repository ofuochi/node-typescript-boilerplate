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
import { config as env } from "../../../infrastructure/config";
import { iocContainer } from "../../../infrastructure/config/ioc";
import { TenantRepository } from "../../../infrastructure/db/repositories/tenant_repository";
import { HttpError } from "../../error";
import { DecodedJwt } from "../../services/auth_service";
import { X_AUTH_TOKEN_KEY } from "../../constants/header_constants";

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
        request: Request,
        securityName: string,
        roles: string[] = ["user"]
    ): Promise<DecodedJwt> => {
        if (securityName.toLowerCase() !== "jwt")
            throw new Error("Invalid security name");

        const token = request.headers[X_AUTH_TOKEN_KEY.toLowerCase()] as string;
        console.log(request.headers);
        if (!token)
            throw new HttpError(
                httpStatus.UNAUTHORIZED,
                `${X_AUTH_TOKEN_KEY} is missing!`
            );

        try {
            const decodedJwt = jwt.verify(token, env.jwtSecret) as DecodedJwt;
            const userRole = (UserRole as any)[roles[0].toUpperCase()];
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
            return decodedJwt;
        } catch (error) {
            throw new HttpError(httpStatus.BAD_REQUEST, error);
        }
    };
}
export const expressAuthentication = authentication(iocContainer);
export const authMiddleware = authMiddlewareFactory(iocContainer);
