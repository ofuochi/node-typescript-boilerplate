import { CurrentUser } from "./../src/domain/utils/globals";
import { cleanUpMetadata } from "inversify-express-utils";
import mongoose from "mongoose";

import app = require("../src");
import { TYPES } from "../src/domain/constants/types";
import { ITenantRepository } from "../src/domain/interfaces/repositories";
import Tenant from "../src/domain/model/tenant";
import { container } from "../src/infrastructure/utils/ioc_container";

before("Setup", async () => {
    await app.startServer();
    cleanUpMetadata();

    const tenantRepository = container.get<ITenantRepository>(
        TYPES.TenantRepository
    );
    await tenantRepository.save(
        Tenant.createInstance("Default", "Default tenant")
    );
});
after("Teardown", async () => {
    const collections = await mongoose.connection.db
        .listCollections(undefined, { nameOnly: true })
        .toArray();
    collections.forEach(async (collection: any) => {
        await mongoose.connection.db.dropCollection(collection.name);
    });
    app.appServer.close();
});
