import { Request } from "express";
import httpStatus from "http-status-codes";
import { Container } from "inversify";
import jwt from "jsonwebtoken";
import { TYPES } from "../../../domain/constants/types";
import { ITenantRepository } from "../../../domain/data/repositories";
import { UserRole } from "../../../domain/model/user";
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

function authentication(iocContainer: Container) {
    return async (
        req: Request,
        securityName: string,
        scopes: string[] = ["user"]
    ): Promise<any> => {
        switch (securityName) {
            case X_AUTH_TOKEN_KEY: {
                const token = req.header(X_AUTH_TOKEN_KEY);
                // Check if X-Auth-Token header was passed in sign-up endpoint
                if (!token)
                    throw new HttpError(
                        httpStatus.UNAUTHORIZED,
                        `Missing ${X_AUTH_TOKEN_KEY} header!`
                    );
                await assignJwt(token, scopes, iocContainer);
                return token;
            }
            case X_TENANT_ID: {
                const tenantId = req.header(X_TENANT_ID);
                if (!tenantId)
                    throw new HttpError(
                        httpStatus.BAD_REQUEST,
                        `Missing ${X_TENANT_ID} header!`
                    );
                await assignTenantToReqAsync(iocContainer, tenantId);
                return tenantId;
            }
            default:
                throw new HttpError(
                    httpStatus.INTERNAL_SERVER_ERROR,
                    "Invalid security name"
                );
        }
    };
}

async function assignJwt(
    token: string,
    scopes: string[],
    iocContainer: Container
) {
    try {
        const decodedJwt = jwt.verify(token, env.jwtSecret) as DecodedJwt;
        const expectedUserRole = (UserRole as any)[scopes[0].toUpperCase()];
        if (
            expectedUserRole !== UserRole.USER &&
            decodedJwt.role !== expectedUserRole
        )
            throw new HttpError(httpStatus.FORBIDDEN, "Access denied!");

        const tenantRepository = iocContainer.get<ITenantRepository>(
            TenantRepository
        );
        const tenant = await tenantRepository.findById(decodedJwt.tenantId);

        if (!tenant || !tenant.isActive)
            throw new HttpError(
                httpStatus.UNAUTHORIZED,
                "Tenant is not available!"
            );
        if (!iocContainer.isBound(TYPES.TenantId))
            iocContainer
                .bind<string>(TYPES.TenantId)
                .toConstantValue(decodedJwt.tenantId);

        if (iocContainer.isBound(TYPES.DecodedJwt))
            iocContainer.unbind(TYPES.DecodedJwt);
        iocContainer
            .bind<DecodedJwt>(TYPES.DecodedJwt)
            .toConstantValue(decodedJwt);
    } catch (error) {
        throw new HttpError(error.status, error.message);
    }
}
async function assignTenantToReqAsync(
    iocContainer: Container,
    tenantId: string
) {
    if (!isIdValid(tenantId))
        throw new HttpError(
            httpStatus.BAD_REQUEST,
            `${tenantId} is not a valid ${X_TENANT_ID} header`
        );
    const tenantRepo = iocContainer.get<ITenantRepository>(TenantRepository);
    const tenant = await tenantRepo.findById(tenantId);
    if (!tenant)
        throw new HttpError(
            httpStatus.UNAUTHORIZED,
            `Tenant ${tenantId} is unavailable`
        );
    if (iocContainer.isBound(TYPES.TenantId))
        iocContainer.unbind(TYPES.TenantId);

    iocContainer.bind<string>(TYPES.TenantId).toConstantValue(tenant.id);
}
export const expressAuthentication = authentication(iocContainer);
