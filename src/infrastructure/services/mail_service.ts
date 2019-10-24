import Agenda from "agenda";
import Mailgun from "mailgun-js";
import { TYPES } from "../../core/domain/constants/types";
import { IMailService } from "../../core/application/services";
import { config } from "../config";
import { iocContainer, provideSingleton } from "../config/ioc";
import { MailJobType } from "../jobs/mail_job";

@provideSingleton(MailService)
export class MailService implements IMailService {
    private readonly _mailgun: Mailgun.Mailgun = Mailgun({
        apiKey: config.emails.apiKey,
        domain: config.emails.domain
    });

    public async sendWelcomeEmail(
        to: string,
        subject: string,
        text: string
    ): Promise<boolean> {
        /**
         * @TODO Call Mailchimp/Sendgrid or whatever
         */
        // Added example for sending mail from mailgun
        const resp = await this._mailgun
            .messages()
            .send({ from: config.emails.from, to, subject, text });

        return resp != null;
    }
    public startEmailSequence(sequenceType: MailJobType, data: any): void {
        const agenda = iocContainer.get<Agenda>(TYPES.Agenda);
        switch (sequenceType) {
            case MailJobType.SEND_WELCOME_MAIL:
                agenda.schedule(
                    "in 2 minutes",
                    MailJobType[MailJobType.SEND_WELCOME_MAIL],
                    data
                );
                break;
            default:
                break;
        }
    }
}
