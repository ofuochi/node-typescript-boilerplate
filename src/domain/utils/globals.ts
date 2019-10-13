import { Tenant } from "../model/tenant";
import { User } from "../model/user";
import { Writable } from "./writable";

export class CurrentUser {
    private static Instance: CurrentUser;
    readonly tenant: Tenant;
    readonly user?: User;
    private constructor(tenant: Tenant, user?: User) {
        this.tenant = tenant;
        this.user = user;
    }
    static createInstance = (tenant: Tenant, user?: User): CurrentUser => {
        if (CurrentUser.Instance) return CurrentUser.Instance;
        return new CurrentUser(tenant, user);
    };
    setUser = (user: User) => {
        (this as Writable<CurrentUser>).user = user;
    };
    setTenant = (tenant: Tenant) => {
        (this as Writable<CurrentUser>).tenant = tenant;
    };
}
