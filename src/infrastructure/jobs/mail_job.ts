import { TYPES } from "../../domain/constants/types";
import { ILoggerService } from "../../domain/interfaces/services";
import { User } from "../../domain/model/user";
import { container } from "../utils/ioc_container";

export enum MailJobType {
    SEND_WELCOME_MAIL
}

export default class MailJob {
    async sendWelcomeEmail(job: any, done: Function): Promise<void> {
        const logger = container.get<ILoggerService>(TYPES.LoggerService);
        // const mailService = container.get<IMailService>(TYPES.MailService);
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
