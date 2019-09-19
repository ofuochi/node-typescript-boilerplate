import { loggerService, mailService } from "../../domain/constants/decorators";
import { ILoggerService, IMailService } from "../../domain/interfaces/services";
import { User } from "../../domain/model/user";

export enum MailJobType {
    SEND_WELCOME_MAIL
}

export default class MailJob {
    @mailService private readonly _mailService: IMailService;
    @loggerService private readonly _logger: ILoggerService;

    async sendWelcomeEmail(job: any, done: Function): Promise<void> {
        try {
            this._logger.debug("✔️  Email Sequence Job triggered!");
            const { email, firstName }: User = job.attrs.data;
            console.log(email);
            await this._mailService.sendWelcomeEmail(
                email,
                "Welcome to Travela",
                `Hello ${firstName}.\nWelcome to Travela`
            );
            done();
        } catch (e) {
            this._logger.error("❌  Error with Email Sequence Job: ", e);
            done(e);
        }
    }
}
