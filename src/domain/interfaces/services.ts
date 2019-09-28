import { MailJobType } from "../../infrastructure/jobs/mail_job";

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
    create(
        name: string,
        description: string
    ): Promise<{ id: string; name: string; isActive: boolean }>;
}
