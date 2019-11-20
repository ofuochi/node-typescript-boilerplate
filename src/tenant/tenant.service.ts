import { Injectable } from '@nestjs/common';

import { TenantRepository } from './repository/tenant.repository';
import { Tenant } from './tenant.entity';

@Injectable()
export class TenantService {
  constructor(private readonly _tenantRepository: TenantRepository) {}
  async create(name: string, description: string) {
    const tenant = Tenant.createInstance(name, description);
    return this._tenantRepository.insertOrUpdate(tenant);
  }
}
