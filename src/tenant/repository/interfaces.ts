import { IBaseRepository } from '../../db/interfaces/repo.interface';
import { Tenant } from '../tenant.entity';

export type ITenantRepository = IBaseRepository<Tenant>;
