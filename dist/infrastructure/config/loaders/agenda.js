"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const agenda_1 = __importDefault(require("agenda"));
const config_1 = __importDefault(require("../../config"));
exports.default = () => new agenda_1.default({
    db: {
        address: config_1.default.mongoDbConnection,
        collection: config_1.default.agenda.dbCollection
    },
    processEvery: config_1.default.agenda.pooltime,
    maxConcurrency: config_1.default.agenda.concurrency
});
//# sourceMappingURL=agenda.js.map