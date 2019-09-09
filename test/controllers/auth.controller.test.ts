import "mocha";
import { expect } from "chai";

import UserEntity from "../../src/models/entities/UserEntity";
import UserRepo from "../../src/db/repos/user.repo";

describe("Hello here", () => {
    const user = UserEntity.createInstance({
        firstName: "FirstName",
        lastName: "LastName",
        email: "email@gmail.com",
        password: "password",
        username: "username",
        tenantId: "tenantId"
    });
    user.setAsDeleted();
    console.log(user);
    const repo = UserRepo;
    console.log(repo);
    before("Running Before", () => {
        console.log(user);

        expect(1 + 2).to.equal(3);
    });
});
