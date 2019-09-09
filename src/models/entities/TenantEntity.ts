import BaseEntity from "./BaseEntity";

export default class TenantEntity extends BaseEntity {
	private _name: string;
	public get name(): string {
		return this._name;
	}
	private setName(v: string) {
		if (!v) throw new Error("Tenant name must be truthy");
		this._name = v
			.trim()
			.toUpperCase()
			.replace(/ /g, "_");
	}

	private _description?: string;
	public get description(): string | undefined {
		return this._description;
	}
	private setDescription(v?: string) {
		if (v) this._description = v.trim();
	}

	private constructor(name: string, description?: string) {
		super();
		this.setName(name);
		this._name = name;
		this.setDescription(description);
	}

	static createInstance({
		tenantName,
		description
	}: {
		tenantName: string;
		description?: string;
	}) {
		return new TenantEntity(tenantName, description);
	}
}
