import { MailJobType } from "../../infrastructure/jobs/mail_job";

export interface IMailService {
    /**
     * Sends a welcome email
     *
     * @param {string} to the email address of the receiver
     * @param {string} subject the subject of the mail
     * @param {string} text the text content of the mail
     * @returns {Promise<boolean>}
     * @memberof IMailService
     */
    sendWelcomeEmail(
        to: string,
        subject: string,
        text: string
    ): Promise<boolean>;
    /**
     *
     *
     * @param {MailJobType} sequenceType
     * @param {*} data
     * @memberof IMailService
     */
    startEmailSequence(sequenceType: MailJobType, data: any): void;
}
