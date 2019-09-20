import { mailService } from "../../domain/constants/decorators";
import { TYPES } from "../../domain/constants/types";
import { ILoggerService, IMailService } from "../../domain/interfaces/services";
import { User } from "../../domain/model/user";
import { container } from "../utils/ioc_container";

export enum MailJobType {
    SEND_WELCOME_MAIL
}

export default class MailJob {
    @mailService private readonly _mailService: IMailService;

    async sendWelcomeEmail(job: any, done: Function): Promise<void> {
        const logger = container.get<ILoggerService>(TYPES.LoggerService);
        try {
            logger.debug("✔️  Email Sequence Job triggered!");
            const { email, firstName }: User = job.attrs.data;
            await this._mailService.sendWelcomeEmail(
                email,
                "Welcome to Travela",
                `Hello ${firstName}.\nWelcome to Travela`
            );
            done();
        } catch (e) {
            logger.error("❌  Error with Email Sequence Job: ", e);
            done(e);
        }
    }
}
