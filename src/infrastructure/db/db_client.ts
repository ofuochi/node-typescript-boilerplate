import bcrypt from "bcrypt";
import mongoose, { Mongoose } from "mongoose";
import { Tenant } from "../../domain/model/tenant";
import { User, UserRole } from "../../domain/model/user";
import { winstonLoggerInstance } from "../bootstrapping/loaders/logger";

export type DbClient = Mongoose;
export async function seedDefaultTenant() {
    const tenantInstance = Tenant.createInstance("Default", "Default tenant");
    const tenantModel = tenantInstance.getModelForClass(Tenant, {
        schemaOptions: { collection: "Tenants", timestamps: true }
    });
    const defaultTenant = await tenantModel.findOne({ name: "Default" });

    if (defaultTenant) return defaultTenant.id;
    return tenantModel.create(tenantInstance);
}
export async function seedDefaultAdmin(tenantId: string) {
    const password = await bcrypt.hash("123qwe", 1);
    const userInstance = User.createInstance({
        firstName: "Admin",
        lastName: "Admin",
        username: "Admin",
        email: "defaultAdmin@email.com",
        tenantId,
        password
    });
    const tenantModel = userInstance.getModelForClass(User, {
        schemaOptions: { collection: "Users", timestamps: true }
    });
    const defaultAdminUser = await tenantModel.findOne({
        $or: [
            { email: userInstance.email, tenant: tenantId },
            { username: userInstance.username, tenant: tenantId }
        ]
    });
    if (!defaultAdminUser) {
        userInstance.setRole(UserRole.ADMIN);
        userInstance.setTenant(tenantId as any);

        await tenantModel.create(userInstance);
    }
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

            resolve(mongoose);
        });
    });
}
