// import loggerInstance from "./logger";
// import agendaFactory from "./agenda";
// import config from "../../config";
// import mailgun from "mailgun-js";

// export default ({
//     mongoConnection,
//     models
// }: {
//     mongoConnection;
//     models: { name: string; model: any }[];
// }) => {
//     try {
//         models.forEach(m => {
//             Container.set(m.name, m.model);
//         });

//         const agendaInstance = agendaFactory({ mongoConnection });

//         Container.set("agendaInstance", agendaInstance);
//         Container.set("logger", loggerInstance);

//         loggerInstance.info("✔️  Agenda injected into container");

//         return { agenda: agendaInstance };
//     } catch (e) {
//         loggerInstance.error("❌ Error on dependency injector loader: %o", e);
//         throw e;
//     }
// };
