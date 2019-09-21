import Agenda from "agenda";
import config from "../../config";

export default new Agenda({
    db: {
        address: config.mongoDbConnection,
        collection: config.agenda.dbCollection
    },
    maxConcurrency: config.agenda.concurrency
});
