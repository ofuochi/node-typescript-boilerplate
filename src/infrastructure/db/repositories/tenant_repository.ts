import { Document } from "mongoose";
import { Tenant } from "../../../domain/model/tenant";
import { provideSingleton } from "../../config/ioc";
import { BaseRepository } from "./base_repository";

export interface TenantModel extends Tenant, Document {}

@provideSingleton(TenantRepository)
export class TenantRepository extends BaseRepository<Tenant, TenantModel> {
    constructor() {
        super(Tenant.model, () => new Tenant());
    }
}
