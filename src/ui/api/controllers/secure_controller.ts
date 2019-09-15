import { controller, httpGet } from "inversify-express-utils";
import { authMiddleware } from "../middleware/auth_middleware";

// This is an example of a controller protected by the auth middleware

@controller("/api/secure", authMiddleware({ role: "admin" }))
export class SecureController {
	@httpGet("/")
	public async get() {
		return Promise.resolve(["This", "data", "is", "secure!"]);
	}
}
