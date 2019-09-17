"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../../../domain/constants/types");
const ioc_container_1 = require("../../../infrastructure/utils/ioc_container");
function getEmailFromToken(token) {
    return __awaiter(this, void 0, void 0, function* () {
        // This is a fake implementation to simplify this example
        // in real life you want to use something like JWT
        // https://github.com/auth0/node-jsonwebtoken
        return new Promise((resolve, reject) => {
            if (token === "SOME_VALID_CREDENTIAL") {
                resolve("test.test@test.com");
            }
            else {
                resolve(null);
            }
        });
    });
}
function authMiddlewareFactory(container) {
    return (config) => {
        return (req, res, next) => {
            const accountRepository = container.get(types_1.TYPES.UserRepository);
            (() => __awaiter(this, void 0, void 0, function* () {
                // get email using auth token
                const token = req.headers["x-auth-token"];
                const email = yield getEmailFromToken(token);
                if (email !== null) {
                    // find user with matching email
                    const matched = yield accountRepository.findManyByQuery({
                        email: email
                    });
                    // Check user has required role
                    if (matched.length === 1 &&
                        matched[0].roles.indexOf(config.role) !== -1) {
                        next();
                    }
                    else {
                        res.status(403).end("Forbidden");
                    }
                }
                else {
                    res.status(401).end("Unauthorized");
                }
            }))();
        };
    };
}
const authMiddleware = authMiddlewareFactory(ioc_container_1.container);
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=auth_middleware.js.map