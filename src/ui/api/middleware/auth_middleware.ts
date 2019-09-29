import httpStatus from 'http-status-codes'
import jwt from 'jsonwebtoken'
import { NextFunction, Request, Response } from 'express'
import { Container } from 'inversify'
import { BaseMiddleware } from 'inversify-express-utils'

import env from '../../../infrastructure/config'
import HttpError from '../../error'
import { UserRole } from './../../../domain/model/user'
import { TYPES } from '../../../domain/constants/types'
import { IUserRepository } from '../../../domain/interfaces/repositories'
import { container } from '../../../infrastructure/utils/ioc_container'

export class AuthMiddleware extends BaseMiddleware {
    private config: { role: UserRole };
    handler = (req: Request, res: Response, next: NextFunction): void => {
        const accountRepository = container.get<IUserRepository>(
            TYPES.UserRepository
        );
        (async () => {
            console.log(this.config);
            console.log("This is where I am now");
            // get email using auth token
            const token = req.header("X-AUTH-TOKEN") as string;
            console.log(token);
            const result = decodeJwt(token);
            console.log(result);
            let decodedJwt;
            try {
                decodedJwt = jwt.verify(token, env.jwtSecret) as any;
            } catch (error) {
                throw new HttpError(httpStatus.BAD_REQUEST, error);
            }
            const email = decodedJwt.email as string;
            console.log(decodedJwt);
            if (email) {
                // find user with matching email
                const userRec = await accountRepository.findOneByQuery({
                    email
                });

                // Check user has required role
                if (userRec && userRec.role) {
                    next();
                } else {
                    res.status(httpStatus.FORBIDDEN).end("Forbidden");
                }
            } else {
                res.status(httpStatus.UNAUTHORIZED).end("Unauthorized");
            }
        })();
    };
    authenticate = (config: { role: UserRole }) => {
        this.config = config;
        return this.handler;
    };
}

function decodeJwt(token: string) {
    try {
        return jwt.verify(token, env.jwtSecret);
    } catch (error) {
        throw new HttpError(httpStatus.BAD_REQUEST, error);
    }
}

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
                    const decodedJwt = jwt.verify(token, env.jwtSecret) as any;
                    const userRecord = await accountRepository.findOneByQuery({
                        email: decodedJwt.email
                    });
                    return userRecord && userRecord.role === config.role
                        ? next()
                        : res.status(httpStatus.FORBIDDEN).end("Forbidden");
                } catch (error) {
                    return next(new HttpError(httpStatus.BAD_REQUEST, error));
                }
            })();
        };
    };
}

const authMiddleware = authMiddlewareFactory(container);

export { authMiddleware };
