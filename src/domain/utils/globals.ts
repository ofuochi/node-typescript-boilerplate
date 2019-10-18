import { Tenant } from "../model/tenant";
import { User } from "../model/user";
import { Writable } from "./writable";
import { DecodedJwt } from "../../ui/services/auth_service";

export class CurrentUser {
    private static Instance: CurrentUser;
    readonly tenant: Tenant;
    readonly user?: User;
    readonly decodedJwt?: DecodedJwt;
    private constructor(tenant: Tenant, user?: User) {
        this.tenant = tenant;
        this.user = user;
    }
    static createInstance = (tenant: Tenant, user?: User): CurrentUser => {
        if (CurrentUser.Instance) return CurrentUser.Instance;
        return new CurrentUser(tenant, user);
    };
    setUserDetails = (decodedJwt: DecodedJwt) => {
        (this as Writable<this>).decodedJwt = decodedJwt;
    };
    setUser = (user: User) => {
        (this as Writable<this>).user = user;
    };
    setTenant = (tenant: Tenant) => {
        (this as Writable<this>).tenant = tenant;
    };
    setDecodedJwt = (decodedJwt: DecodedJwt) => {
        (this as Writable<this>).decodedJwt = decodedJwt;
    };
}
