import { MailJobType } from "../../infrastructure/jobs/mail_job";
import { TenantDto } from "ui/models/tenant_dto";

export interface IMailService {
    sendWelcomeEmail(
        to: string,
        subject: string,
        text: string
    ): Promise<boolean>;
    startEmailSequence(sequenceType: MailJobType, data: any): void;
}

export interface ILoggerService {
    silly(message: string, meta?: any): void;
    error(message: string, meta?: any): void;
    info(message: string, meta?: any): void;
    debug(message: string, meta?: any): void;
    warn(message: string, meta?: any): void;
}
export interface ITenantService {
    create(name: string, description: string): Promise<TenantDto>;
    get(name: string): Promise<TenantDto | undefined>;
    search(name?: string): Promise<TenantDto[]>;
}
