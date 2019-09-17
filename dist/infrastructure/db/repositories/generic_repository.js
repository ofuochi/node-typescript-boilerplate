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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
const inversify_1 = require("inversify");
const mongoose_1 = require("mongoose");
const decorators_1 = require("../../../domain/constants/decorators");
let BaseRepository = class BaseRepository {
    constructor(dbClient, name, schemaDefinition) {
        this._name = name;
        const schema = new mongoose_1.Schema(schemaDefinition, { collection: this._name });
        this.Model = dbClient.model(this._name, schema);
    }
    // We wrap the mongoose API here so we can use async / await
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.Model.find((err, res) => {
                    if (err) {
                        reject(err);
                    }
                    const result = res.map(r => this._readMapper(r));
                    resolve(result);
                });
            });
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.Model.findById(id, (err, res) => {
                    if (err) {
                        reject(err);
                    }
                    if (res === null) {
                        reject();
                    }
                    else {
                        const result = this._readMapper(res);
                        resolve(result);
                    }
                });
            });
        });
    }
    save(doc) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const instance = new this.Model(doc);
                instance.save((err, res) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(this._readMapper(res));
                });
            });
        });
    }
    findManyById(ids) {
        return new Promise((resolve, reject) => {
            const query = { _id: { $in: ids } };
            this.Model.find(query, (err, res) => {
                if (err) {
                    reject(err);
                }
                resolve(res.map(r => this._readMapper(r)));
            });
        });
    }
    findManyByQuery(query) {
        return new Promise((resolve, reject) => {
            this.Model.find(query, (err, res) => {
                if (err) {
                    reject(err);
                }
                resolve(res.map(r => this._readMapper(r)));
            });
        });
    }
    _readMapper(model) {
        const obj = model.toJSON();
        const propDesc = Object.getOwnPropertyDescriptor(obj, "_id");
        Object.defineProperty(obj, "id", propDesc);
        delete obj["_id"];
        return obj;
    }
};
BaseRepository = __decorate([
    inversify_1.injectable(),
    __param(0, decorators_1.dbClient),
    __param(1, inversify_1.unmanaged()),
    __param(2, inversify_1.unmanaged()),
    __metadata("design:paramtypes", [Object, String, Object])
], BaseRepository);
exports.BaseRepository = BaseRepository;
//# sourceMappingURL=generic_repository.js.map