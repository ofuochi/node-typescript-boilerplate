export interface IMustHaveTenant {
    tenant: any;
}
export interface IActiveStatus {
    isActive: boolean;
    deactivate(): void;
}
