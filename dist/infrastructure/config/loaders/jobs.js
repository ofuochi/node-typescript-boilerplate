"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../../config"));
const email_jobs_1 = __importDefault(require("../../jobs/email_jobs"));
exports.default = (agenda) => {
    agenda.define("send-email", { priority: "high", concurrency: config_1.default.agenda.concurrency }, email_jobs_1.default.sendWelcomeEmail);
    agenda.start();
};
//# sourceMappingURL=jobs.js.map