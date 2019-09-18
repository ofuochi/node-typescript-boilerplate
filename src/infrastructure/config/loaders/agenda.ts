import Agenda from "agenda";
import config from "../../config";

export default () =>
    new Agenda({
        db: {
            address: config.mongoDbConnection,
            collection: config.agenda.dbCollection
        },
        processEvery: config.agenda.pooltime,
        maxConcurrency: config.agenda.concurrency
    });
