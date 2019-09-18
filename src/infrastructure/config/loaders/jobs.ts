import Agenda from "agenda";
import config from "../../config";
import EmailSequenceJob from "../../jobs/email_jobs";

export default (agenda: Agenda) => {
    agenda.define(
        "send-email",
        { priority: "high", concurrency: config.agenda.concurrency },
        EmailSequenceJob.sendWelcomeEmail
    );
    agenda.start();
};
