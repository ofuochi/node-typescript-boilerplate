import { Tenant } from "../model/tenant";
import { User } from "../model/user";
import { Writable } from "./writable";

export class CurrentUser {
    private static _instance: CurrentUser;
    readonly tenant: Tenant;
    readonly user?: User;
    private constructor(tenant: Tenant, user?: User) {
        this.tenant = tenant;
        this.user = user;
    }
    static createInstance = (tenant: Tenant, user?: User): CurrentUser => {
        if (CurrentUser._instance) return CurrentUser._instance;
        const newInstance = new CurrentUser(tenant, user);
        return newInstance;
    };
    setUser = (user: User) => {
        (this as Writable<CurrentUser>).user = user;
    };
    setTenant = (tenant: Tenant) => {
        (this as Writable<CurrentUser>).tenant = tenant;
    };
}
