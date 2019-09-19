import { injectable } from "inversify";

import { IMailService } from "../../domain/interfaces/services";
import Mailgun from "mailgun-js";
import config from "../config/env";
import { MailJobType } from "../jobs/mail_job";
import { container } from "../utils/ioc_container";
import Agenda from "agenda";
import { TYPES } from "../../domain/constants/types";

@injectable()
export default class MailService implements IMailService {
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
        const agenda = container.get<Agenda>(TYPES.Agenda);
        switch (sequenceType) {
            case MailJobType.SEND_WELCOME_MAIL:
                agenda.now(MailJobType.SEND_WELCOME_MAIL.toString(), data);
                break;
            default:
                break;
        }
    }
}
