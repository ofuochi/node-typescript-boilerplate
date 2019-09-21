import { injectable } from "inversify";
import { Document } from "mongoose";

import { dbClient } from "../../../domain/constants/decorators";
import Tenant from "../../../domain/model/tenant";
import { DbClient } from "../db_client";
import { BaseRepository } from "./base_repository";

export interface TenantModel extends Tenant, Document {}

@injectable()
export class TenantRepository extends BaseRepository<Tenant, TenantModel> {
    constructor(@dbClient dbClient: DbClient) {
        super(dbClient, "Tenants", Tenant.model.schema);
    }
}
