// import jwt from "jsonwebtoken";
// import { injectable, inject } from "inversify";
// import bcrypt from "bcrypt";
// import MailerService from "../../infrastructure/services/mail_service";
// import events from "../subscribers/events";
// import { IAuthService } from "../interfaces/auth_service";
// import { User } from "../../domain/model/user";
// import config from "../../config";
// import { IUserRepository } from "../../domain/interfaces/repositories";
// import { userRepository } from "../../domain/constants/decorators";
// import loggerInstance from "./../loaders/logger";
// import winston from "winston";

// @injectable()
// export default class AuthService implements IAuthService {
//     @userRepository private _userRepo: IUserRepository;
//     constructor(
//         private mailer: MailerService
//     ) // @inject("loggerInstance") private logger: winston.Logger,
//     // @EventDispatcher() private eventDispatcher: EventDispatcherInterface
//     {}

//     public async signUp(user: User): Promise<{ user: User; token: string }> {
//         try {
//             this.logger.silly("Hashing password");
//             const hashedPassword = await bcrypt.hash(user.password, 10);
//             this.logger.silly("Creating user db record");
//             const userRecord = await this._userRepo.save({
//                 ...user,
//                 password: hashedPassword
//             });
//             this.logger.silly("Generating JWT");
//             const token = this.generateToken(userRecord);

//             if (!userRecord) {
//                 throw new Error("User cannot be created");
//             }
//             this.logger.silly("Sending welcome email");
//             await this.mailer.SendWelcomeEmail(userRecord);

//             this.eventDispatcher.dispatch(events.user.signUp, {
//                 user: userRecord
//             });

//             /**
//              * @TODO This is not the best way to deal with this
//              * There should exist a 'Mapper' layer
//              * that transforms data from layer to layer
//              * but that's too over-engineering for now
//              */
//             const user = userRecord.toObject();
//             Reflect.deleteProperty(user, "password");
//             Reflect.deleteProperty(user, "salt");
//             return { user, token };
//         } catch (e) {
//             this.logger.error(e);
//             throw e;
//         }
//     }

//     public async signIn(
//         emailOrUsername: string,
//         password: string
//     ): Promise<{ user: User; token: string }> {
//         const userRecords = await this._userRepo.findManyByQuery({
//             email: emailOrUsername
//         });
//         if (!userRecords) {
//             throw new Error("User not registered");
//         }

//         /**
//          * We use verify from argon2 to prevent 'timing based' attacks
//          */
//         this.logger.silly("Checking password");
//         const userRecord = userRecords[0];
//         const validPassword = await bcrypt.compare(
//             userRecord.password,
//             password
//         );
//         if (validPassword) {
//             this.logger.silly("Password is valid!");
//             this.logger.silly("Generating JWT");
//             const token = await this.generateToken(userRecord);

//             const user = userRecord.toObject();
//             Reflect.deleteProperty(user, "password");
//             Reflect.deleteProperty(user, "salt");
//             /**
//              * Easy as pie, you don't need passport.js anymore :)
//              */
//             return { user, token };
//         } else {
//             throw new Error("Invalid Password");
//         }
//     }

//     private async generateToken(user: User) {
//         const today = new Date();
//         const exp = new Date(today);
//         exp.setDate(today.getDate() + 60);

//         /**
//          * A JWT means JSON Web Token, so basically it's a json that is _hashed_ into a string
//          * The cool thing is that you can add custom properties a.k.a metadata
//          * Here we are adding the userId, role and name
//          * Beware that the metadata is public and can be decoded without _the secret_
//          * but the client cannot craft a JWT to fake a userId
//          * because it doesn't have _the secret_ to sign it
//          * more information here: https://softwareontheroad.com/you-dont-need-passport
//          */
//         this.logger.silly(`Sign JWT for userId: ${user.id}`);

//         return await jwt.sign(
//             {
//                 id: user.id, // We are gonna use this in the middleware 'isAuth'
//                 roles: user.roles,
//                 name: user.username,
//                 exp: exp.getTime() / 1000
//             },
//             config.jwtSecret
//         );
//     }
// }
