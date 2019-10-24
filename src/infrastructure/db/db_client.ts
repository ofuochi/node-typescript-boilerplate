import bcrypt from "bcrypt";
import mongoose, { Mongoose } from "mongoose";
import { Tenant } from "../../core/domain/models/tenant";
import { User, UserRole } from "../../core/domain/models/user";
import { winstonLoggerInstance } from "../bootstrapping/loaders/logger";

export type DbClient = Mongoose;
export async function seedDefaultTenant() {
    const tenant = Tenant.createInstance("Default", "Default tenant");
    const tenantModel = Tenant.getModel();
    const defaultTenant = await tenantModel.findOne({ name: "Default" });

    if (defaultTenant) return defaultTenant.id;
    return tenantModel.create(tenant);
}
export async function seedDefaultAdmin(tenantId: string) {
    const password = await bcrypt.hash("123qwe", 1);
    const user = User.createInstance({
        firstName: "Admin",
        lastName: "Admin",
        username: "Admin",
        email: "defaultAdmin@email.com",
        tenantId,
        password
    });
    const userModel = User.getModel();
    const defaultAdminUser = await userModel.findOne({
        $or: [
            { email: user.email, tenant: tenantId },
            { username: user.username, tenant: tenantId }
        ]
    });
    if (!defaultAdminUser) {
        user.setRole(UserRole.ADMIN);
        await userModel.create(user);
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
