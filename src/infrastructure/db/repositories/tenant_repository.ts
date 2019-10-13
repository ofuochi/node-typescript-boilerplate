import { injectable } from "inversify";
import { Document } from "mongoose";

import { Tenant } from "../../../domain/model/tenant";
import { BaseRepository } from "./base_repository";

export interface TenantModel extends Tenant, Document {}

@injectable()
export class TenantRepository extends BaseRepository<
    Tenant,
    TenantModel
> {
    constructor() {
        super(Tenant.model, () => new Tenant());
    }
}
