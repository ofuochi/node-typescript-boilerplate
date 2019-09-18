"use strict";
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
const dotenv_1 = __importDefault(require("dotenv"));
const bootstrap_1 = require("./infrastructure/bootstrapping/bootstrap");
const ioc_container_1 = require("./infrastructure/utils/ioc_container");
const inversify_config_1 = require("./infrastructure/config/inversify.config");
dotenv_1.default.config();
exports.startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield bootstrap_1.bootstrap({
        container: ioc_container_1.container,
        appPort: parseInt(process.env.APP_PORT || "3000"),
        dbHost: process.env.DB_HOST || "localhost",
        dbName: process.env.DB_NAME || "node-typescript-boilerplate",
        containerModules: [inversify_config_1.referenceDataIoCModule]
    });
});
// Start server if it's not already running
if (!module.parent)
    exports.startServer();
//# sourceMappingURL=index.js.map