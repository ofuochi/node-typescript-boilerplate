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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const logger_1 = __importDefault(require("../../infrastructure/config/loaders/logger"));
let LoggerService = class LoggerService {
    constructor() {
        this._logClient = logger_1.default;
    }
    silly(message, meta) {
        this._logClient.silly(message, meta);
    }
    error(message, meta) {
        this._logClient.error(message, meta);
    }
    info(message, meta) {
        this._logClient.info(message, meta);
    }
    debug(message, meta) {
        this._logClient.debug(message, meta);
    }
    warn(message, meta) {
        this._logClient.warn(message, meta);
    }
};
LoggerService = __decorate([
    inversify_1.injectable(),
    __metadata("design:paramtypes", [])
], LoggerService);
exports.default = LoggerService;
//# sourceMappingURL=log_service.js.map