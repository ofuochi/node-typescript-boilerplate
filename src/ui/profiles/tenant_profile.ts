import { MappingProfileBase, AutoMapper } from "automapper-nartc";
import { Tenant } from "../../domain/model/tenant";
import { TenantDto } from "../models/tenant_dto";

export class TenantProfile extends MappingProfileBase {
    constructor() {
        super();
    }

    configure(mapper: AutoMapper): void {
        mapper
            .createMap(Tenant, TenantDto)
            .forMember("id", options =>
                options.mapFrom(tenant => tenant.id.toString())
            );
    }
}
