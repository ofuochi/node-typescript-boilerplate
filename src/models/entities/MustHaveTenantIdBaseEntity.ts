import BaseEntity from "./BaseEntity";

export default abstract class MustHaveTenantIdBaseEntity extends BaseEntity {
	protected abstract get tenantId();
	protected abstract set tenantId(v: string);
}
