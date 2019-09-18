import Agenda from "agenda";
import config from "../../config/env";
import EmailSequenceJob from "../../jobs/email_jobs";

export const Jobs = {
    sendWelcomeEmail: async (agenda: Agenda): Promise<void> => {
        const emailJob = new EmailSequenceJob();
        const idString = "welcome-email";
        agenda.define(
            idString,
            { priority: "high", concurrency: config.agenda.concurrency },
            async _job => await emailJob.sendWelcomeEmail
        );
        await agenda.start();
        await agenda.schedule(`in 60 seconds`, idString);
    }
};
