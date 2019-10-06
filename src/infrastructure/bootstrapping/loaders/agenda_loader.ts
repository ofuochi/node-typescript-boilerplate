import Agenda from "agenda";
import { config } from "../../config";

export function getAgendaInstance(connStr: string) {
    return new Agenda({
        db: {
            address: connStr,
            collection: config.agenda.dbCollection
        },
        maxConcurrency: config.agenda.concurrency
    });
}
