import mongoose, { Mongoose } from "mongoose";

import { Tenant } from "../../domain/model/tenant";
import { winstonLoggerInstance } from "../bootstrapping/loaders/logger";

export type DbClient = Mongoose;
async function seedDefaultTenant() {
    const tenantInstance = Tenant.createInstance("Default", "Default tenant");
    const tenantModel = tenantInstance.getModelForClass(Tenant, {
        schemaOptions: { collection: "Tenants", timestamps: true }
    });
    const defaultTenant = await tenantModel.findOne({ name: "Default" });
    if (!defaultTenant) await tenantModel.create(tenantInstance);
}

export async function getDatabaseClient(connStr: string) {
    return new Promise<DbClient>((resolve, reject) => {
        mongoose.connect(connStr, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false
        });
        const db = mongoose.connection;
        db.on("error", (e: Error) => {
            winstonLoggerInstance.error("❌ Db connection error:", e);
            reject(e);
        });
        db.once("open", async () => {
            winstonLoggerInstance.info("✔️  Db connection successful");
            await seedDefaultTenant();
            resolve(mongoose);
        });
    });
}
