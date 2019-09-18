import mongoose from "mongoose";
import { EventSubscriber, On } from "event-dispatch";
import events from "./events";
import { User } from "../../domain/model/user";
import { container } from "../../infrastructure/utils/ioc_container";

@EventSubscriber()
export default class UserSubscriber {
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
    public onUserSignIn({ id }: Partial<User>) {
        const Logger = container.get<any>("logger");

        try {
            const UserModel = container.get("UserModel") as mongoose.Model<
                User & mongoose.Document
            >;

            UserModel.update({ id }, { $set: { lastLogin: new Date() } });
        } catch (e) {
            Logger.error(`❌ Error on event ${events.user.signIn}: %o`, e);

            // Throw the error so the process die (check src/app.ts)
            throw e;
        }
    }
    @On(events.user.signUp)
    public onUserSignUp({ email, id }: Partial<User>) {
        const Logger = container.get<any>("logger");

        try {
            /**
             * @TODO implement this
             */
            // Call the tracker tool so your investor knows that there is a new signup
            // and leave you alone for another hour.
            // TrackerService.track('user.signup', { email, _id })
            // Start your email sequence or whatever
            // MailService.startSequence('user.welcome', { email, name })
        } catch (e) {
            Logger.error(`❌ Error on event ${events.user.signUp}: %o`, e);

            // Throw the error so the process dies (check src/app.ts)
            throw e;
        }
    }
}
