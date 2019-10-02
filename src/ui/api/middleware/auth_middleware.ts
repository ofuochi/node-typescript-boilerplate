import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { Container } from "inversify";
import jwt from "jsonwebtoken";

import { TYPES } from "../../../domain/constants/types";
import { IUserRepository } from "../../../domain/interfaces/repositories";
import env from "../../../infrastructure/config";
import { container } from "../../../infrastructure/utils/ioc_container";
import HttpError from "../../error";
import { UserRole } from "./../../../domain/model/user";
import { DecodedJwt } from "../../services/auth_service";

function authMiddlewareFactory(container: Container) {
    return (config: { role: UserRole }) => {
        return (req: Request, res: Response, next: NextFunction) => {
            const accountRepository = container.get<IUserRepository>(
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

                    return userRecord && userRecord.role == config.role
                        ? next()
                        : res.status(httpStatus.FORBIDDEN).end("Forbidden");
                } catch (error) {
                    return next(new HttpError(httpStatus.UNAUTHORIZED, error));
                }
            })();
        };
    };
}

const authMiddleware = authMiddlewareFactory(container);

export { authMiddleware };
