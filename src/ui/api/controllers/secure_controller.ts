import { controller, httpGet } from "inversify-express-utils";

import { authMiddleware } from "../middleware/auth_middleware";
import { UserRole } from "@domain/model/user";

// This is an example of a controller protected by the auth middleware

@controller("/api/secure", authMiddleware({ role: UserRole.ADMIN }))
export class SecureController {
    @httpGet("/")
    public async get() {
        return Promise.resolve(["This", "data", "is", "secure!"]);
    }
}
