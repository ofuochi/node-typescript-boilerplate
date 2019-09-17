import { injectable } from "inversify";

import { User } from "../../domain/model/user";
import { IMailService } from "../../domain/interfaces/services";
import config from "../../config";
import Mailgun = require("mailgun-js");

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
    ): Promise<{ delivered: string; status: string }> {
        /**
         * @TODO Call Mailchimp/Sendgrid or whatever
         */
        // Added example for sending mail from mailgun

        const result = await this._mailgun
            .messages()
            .send({ from: config.emails.from, to, subject, text });

        return { delivered: "result.id", status: "result.message" };
    }
    public startEmailSequence(_sequence: string, user: Partial<User>) {
        if (!user.email) {
            throw new Error("No email provided");
        }
        // @TODO Add example of an email sequence implementation
        // Something like
        // 1 - Send first email of the sequence
        // 2 - Save the step of the sequence in database
        // 3 - Schedule job for second email in 1-3 days or whatever
        // Every sequence can have its own behavior so maybe
        // the pattern Chain of Responsibility can help here.
        return { delivered: 1, status: "ok" };
    }
}
