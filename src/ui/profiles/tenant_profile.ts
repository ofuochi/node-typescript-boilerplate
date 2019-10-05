import { MappingProfileBase } from "automapper-nartc";
import Tenant from "domain/model/tenant";
import { TenantDto } from "ui/models/tenant_dto";

export class TenantProfile extends MappingProfileBase {
    constructor() {
        super();
    }

    configure(): void {
        this.createMap(Tenant, TenantDto);
    }

}