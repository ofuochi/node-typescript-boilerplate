import Tenant from "../model/tenant";

export class CurrentUser {
    readonly tenant: Tenant;
    private constructor(tenant: Tenant) {
        this.tenant = tenant;
    }
    static createInstance = (tenant: Tenant): CurrentUser => {
        return new CurrentUser(tenant);
    };
}
