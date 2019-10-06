import { MappingProfileBase } from "automapper-nartc";
import Tenant from "../../domain/model/tenant";
import { TenantDto } from "../models/tenant_dto";

export default class TenantProfile extends MappingProfileBase {
    constructor() {
        super();
    }

    configure(): void {
        this.createMap(Tenant, TenantDto)
            .forMember("id", options => options.mapFrom(tenant => tenant.id.toString()));
    }

}