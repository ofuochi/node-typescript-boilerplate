import { mailService, loggerService } from "../../domain/constants/decorators";
import { IMailService, ILoggerService } from "../../domain/interfaces/services";

export default class EmailSequenceJob {
    @mailService private readonly _mailService: IMailService;
    @loggerService private readonly _logger: ILoggerService;

    async sendWelcomeEmail(job: any, done: Function): Promise<void> {
        try {
            this._logger.debug("✌️ Email Sequence Job triggered!");
            const { email, firstName } = job.attrs.data;

            await this._mailService.sendWelcomeEmail(
                email,
                "Welcome to Travela",
                `Hello ${firstName}.\nWelcome to Travela`
            );
            done();
        } catch (e) {
            this._logger.error("❌ Error with Email Sequence Job: %o", e);
            done(e);
        }
    }
}
