import { MailJobType } from "../../infrastructure/jobs/mail_job";
import { Movie } from "../model/movie";

export interface ISearchService {
    search(query: string): Promise<Movie[]>;
}

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
