import { ILoggerService } from "../../application/services";
import { User } from "../../domain/model/user";
import { iocContainer } from "../config/ioc";
import { LoggerService } from "../services/logger_service";

export enum MailJobType {
    SEND_WELCOME_MAIL
}

export class MailJob {
    public async sendWelcomeEmail(job: any, done: Function): Promise<void> {
        const logger = iocContainer.get<ILoggerService>(LoggerService);
        // const mailService = iocContainer.get<IMailService>(TYPES.MailService);
        try {
            const { email, firstName }: User = job.attrs.data;

            // Send email
            // await mailService.sendWelcomeEmail(
            //     email,
            //     "Welcome to MyApp",
            //     `Hello ${firstName}.\nWelcome to MyApp`
            // );

            logger.info(`✔️  Email sent to ${email}/${firstName}`);

            done();
        } catch (e) {
            logger.error("❌  Error with Email Sequence Job: ", e);
            done(e);
        }
    }
}
