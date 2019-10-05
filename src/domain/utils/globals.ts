import Tenant from "../model/tenant";
import { User } from "../model/user";
import { Writable } from "./writable";

export default class CurrentUser {
    readonly tenant: Tenant;
    readonly user?: User;
    private constructor(tenant: Tenant, user?: User) {
        this.tenant = tenant;
        this.user = user;
    }
    static createInstance = (tenant: Tenant, user?: User): CurrentUser => {
        return new CurrentUser(tenant, user);
    };
    setUser = (user: User) => {
        (this as Writable<CurrentUser>).user = user;
    };
}
