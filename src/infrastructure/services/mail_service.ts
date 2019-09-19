import { injectable } from "inversify";

import { IMailService } from "../../domain/interfaces/services";
import Mailgun from "mailgun-js";
import config from "../config/env";

@injectable()
export default class MailService implements IMailService {
    private readonly _mailgun: Mailgun.Mailgun;
    constructor() {
        this._mailgun = Mailgun({
            apiKey: config.emails.apiKey,
            domain: config.emails.domain
        });
    }

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
}
