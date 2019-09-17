"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const config_1 = __importDefault(require("../../config"));
const Mailgun = require("mailgun-js");
let MailService = class MailService {
    constructor() {
        this._mailgun = Mailgun({
            apiKey: config_1.default.emails.apiKey,
            domain: config_1.default.emails.domain
        });
    }
    sendWelcomeEmail(to, subject, text) {
        return __awaiter(this, void 0, void 0, function* () {
            /**
             * @TODO Call Mailchimp/Sendgrid or whatever
             */
            // Added example for sending mail from mailgun
            yield this._mailgun
                .messages()
                .send({ from: config_1.default.emails.from, to, subject, text });
            return { delivered: "result.id", status: "result.message" };
        });
    }
    startEmailSequence(_sequence, user) {
        if (!user.email) {
            throw new Error("No email provided");
        }
        // @TODO Add example of an email sequence implementation
        // Something like
        // 1 - Send first email of the sequence
        // 2 - Save the step of the sequence in database
        // 3 - Schedule job for second email in 1-3 days or whatever
        // Every sequence can have its own behavior so maybe
        // the pattern Chain of Responsibility can help here.
        return { delivered: 1, status: "ok" };
    }
};
MailService = __decorate([
    inversify_1.injectable(),
    __metadata("design:paramtypes", [])
], MailService);
exports.default = MailService;
//# sourceMappingURL=mail_service.js.map