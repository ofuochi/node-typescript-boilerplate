// import { Server } from "http";
// import { expect } from "chai";

// import { startServer } from "../../src";
// import MailerService from "./../../src/infrastructure/services/mail_service";
// import { IMailService } from "./../../src/domain/interfaces/services";

// let server: Server;
// describe("Mail service", () => {
//     let mailService: IMailService;
//     before(async () => {
//         server = await startServer();
//         mailService = new MailerService();
//     });
//     after(async () => {
//         await server.close();
//     });

//     it("should send email", async () => {
//         const result = await mailService.sendWelcomeEmail(
//             "fortuneochi@gmail.com",
//             "Hello",
//             "Fortune, I'm testing this thing"
//         );
//         expect(result.delivered).equal(1);
//     });
// });
