import BaseEntity from "./Base";

export default abstract class MustHaveTenantIdBaseEntity extends BaseEntity {
    protected abstract get tenantId();
    protected abstract set tenantId(v: string);
}
