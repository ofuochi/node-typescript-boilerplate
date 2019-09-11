import "mocha";
import { expect } from "chai";

import UserEntity from "../../src/models/entities/UserEntity";
import UserRepo from "../../src/db/repos/user.repo";
import container from "./../../src/config/dependencyInjection/inversify.config";
import { TYPES } from "../../src/config/dependencyInjection/typeMapping";

before("Running Before", async () => {
    console.log("".italics());
    expect(1 + 2).to.equal(3);
    const user = UserEntity.createInstance({
        firstName: "FirstName",
        lastName: "LastName",
        email: "email@gmail.com",
        password: "password",
        username: "username",
        tenantId: "tenantId"
    });
    const newUser = await container.get<UserRepo>(TYPES.UserRepo);
    console.log(newUser);
});
describe("Hello here", async () => {});
