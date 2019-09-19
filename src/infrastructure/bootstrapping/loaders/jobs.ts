import Agenda from "agenda";

import config from "../../config/env";
import MailJob, { MailJobType } from "../../jobs/mail_job";

export const Jobs = [
    async function sendWelcomeEmail(agenda: Agenda): Promise<void> {
        const emailJob = new MailJob();
        const idString = MailJobType.SEND_WELCOME_MAIL.toString();
        agenda.define(
            idString,
            { priority: "high", concurrency: config.agenda.concurrency },
            async _job => await emailJob.sendWelcomeEmail
        );

        await agenda.start();
        await agenda.schedule("in 1 minute", idString);
    }
];
