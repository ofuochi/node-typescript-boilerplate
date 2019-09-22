import { Request, Response, NextFunction } from "express";
import { Container } from "inversify";
import { IUserRepository } from "../../../domain/interfaces/repositories";
import { TYPES } from "../../../domain/constants/types";
import { container } from "../../../infrastructure/utils/ioc_container";
import httpStatus from "http-status-codes";

async function getEmailFromToken(token: string) {
    // This is a fake implementation to simplify this example
    // in real life you want to use something like JWT
    // https://github.com/auth0/node-jsonwebtoken
    return new Promise<string | null>((resolve, reject) => {
        if (token === "SOME_VALID_CREDENTIAL") {
            resolve("test.test@test.com");
        } else {
            resolve(null);
        }
    });
}

function authMiddlewareFactory(container: Container) {
    return (config: { role: string }) => {
        return (req: Request, res: Response, next: NextFunction) => {
            const accountRepository = container.get<IUserRepository>(
                TYPES.UserRepository
            );

            (async () => {
                // get email using auth token
                const token = req.headers["x-auth-token"] as string;
                const email = await getEmailFromToken(token);

                if (email !== null) {
                    // find user with matching email
                    const matched = await accountRepository.findManyByQuery({
                        email: email
                    });

                    // Check user has required role
                    if (
                        matched.length === 1 &&
                        matched[0].roles.indexOf(config.role) !== -1
                    ) {
                        next();
                    } else {
                        res.status(httpStatus.FORBIDDEN).end("Forbidden");
                    }
                } else {
                    res.status(httpStatus.UNAUTHORIZED).end("Unauthorized");
                }
            })();
        };
    };
}

const authMiddleware = authMiddlewareFactory(container);

export { authMiddleware };
