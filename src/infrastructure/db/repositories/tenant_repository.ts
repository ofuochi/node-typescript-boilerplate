import { Document } from "mongoose";
import { Tenant } from "../../../core/domain/models/tenant";
import { provideSingleton } from "../../config/ioc";
import { BaseRepository } from "./base_repository";

export type TenantModel = Tenant & Document;

@provideSingleton(TenantRepository)
export class TenantRepository extends BaseRepository<Tenant, TenantModel> {
    constructor() {
        super(Tenant.model, () => new Tenant());
    }
}
