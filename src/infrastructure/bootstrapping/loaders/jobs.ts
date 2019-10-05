import Agenda from "agenda";

import config from "../../config";
import MailJob, { MailJobType } from "../../jobs/mail_job";

async function sendWelcomeEmail(agenda: Agenda): Promise<void> {
    const emailJob = new MailJob();
    const jobType = MailJobType[MailJobType.SEND_WELCOME_MAIL];
    agenda.define(
        jobType,
        { priority: "high", concurrency: config.agenda.concurrency },
        emailJob.sendWelcomeEmail
    );
    await agenda.start();
}

export default [sendWelcomeEmail];
