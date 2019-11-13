import * as bcrypt from "bcrypt";

export const hashPw = async (pw: string) => {
  const env = process.env.NODE_ENV;
  const salt = env === "development" || env === "test" ? 1 : 10;
  return bcrypt.hash(pw, salt);
};
