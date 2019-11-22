import * as bcrypt from "bcrypt";
import { PASSWORD_SALT_ROUND } from "../user/user.entity";

export const hashPassword = async (password: string) => {
	const env = process.env.NODE_ENV;
	const salt =
		env === "development" || env === "test" ? 1 : PASSWORD_SALT_ROUND;
	return bcrypt.hash(password, salt);
};
