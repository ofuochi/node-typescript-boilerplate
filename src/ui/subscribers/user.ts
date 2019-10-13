import { EventSubscriber, On } from "event-dispatch";
import mongoose from "mongoose";

import { ILoggerService, IMailService } from "../../domain/interfaces/services";
import { User } from "../../domain/model/user";
import { iocContainer } from "../../infrastructure/config/ioc";
import { TYPES } from "../../domain/constants/types";
import { events } from "./events";
import { MailJobType } from "../../infrastructure/jobs/mail_job";
import { UserDto } from "../models/user_dto";

@EventSubscriber()
export class UserSubscriber {
    private readonly _logger = iocContainer.get<ILoggerService>(
        TYPES.LoggerService
    );
    private readonly _mailService = iocContainer.get<IMailService>(
        TYPES.MailService
    );
    /**
     * A great example of an event that you want to handle
     * save the last time a user sign-in, your boss will be pleased.
     *
     * Although it works in this tiny toy API, please don't do this for a production product
     * just spamming insert/update to mongo will kill it eventually
     *
     * Use another approach like emit events to a queue (rabbitmq/aws sqs),
     * then save the latest in Redis/Memcache or something similar
     */
    @On(events.user.signIn)
    public onUserSignIn({ id }: Partial<UserDto>) {
        try {
            const UserModel = iocContainer.get("UserModel") as mongoose.Model<
                User & mongoose.Document
            >;

            UserModel.update({ id }, { $set: { lastLogin: new Date() } });
        } catch (e) {
            this._logger.error(`❌  Error on event ${events.user.signIn}: `, e);

            // Throw the error so the process dies (check src/app.ts)
            throw new Error(e);
        }
    }
    @On(events.user.signUp)
    public onUserSignUp({ firstName, email }: User) {
        try {
            // Start your email sequence or whatever
            this._mailService.startEmailSequence(
                MailJobType.SEND_WELCOME_MAIL,
                {
                    firstName,
                    email
                }
            );
        } catch (e) {
            this._logger.error(`❌  Error on event ${events.user.signUp}: `, e);

            // Throw the error so the process dies (check src/app.ts)
            throw e;
        }
    }
}
