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
Object.defineProperty(exports, "__esModule", { value: true });
const decorators_1 = require("../../domain/constants/decorators");
class EmailSequenceJob {
    static sendWelcomeEmail(job, done) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this._logger.debug("✌️ Email Sequence Job triggered!");
                const { email, firstName } = job.attrs.data;
                yield this._mailService.sendWelcomeEmail(email, "Welcome to Travela", `Hello ${firstName}.\nWelcome to Travela`);
                done();
            }
            catch (e) {
                this._logger.error("🔥 Error with Email Sequence Job: %o", e);
                done(e);
            }
        });
    }
}
__decorate([
    decorators_1.mailService,
    __metadata("design:type", Object)
], EmailSequenceJob, "_mailService", void 0);
__decorate([
    decorators_1.loggerService,
    __metadata("design:type", Object)
], EmailSequenceJob, "_logger", void 0);
exports.default = EmailSequenceJob;
//# sourceMappingURL=email_jobs.js.map