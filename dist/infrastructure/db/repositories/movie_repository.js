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
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const decorators_1 = require("../../../domain/constants/decorators");
const generic_repository_1 = require("./generic_repository");
let MovieRepository = class MovieRepository extends generic_repository_1.BaseRepository {
    constructor(dbClient) {
        super(dbClient, "Movies", {
            title: String,
            releaseYear: Number,
            releaseMonth: Number,
            releaseDay: Number,
            summary: String,
            actors: [String],
            directors: [String]
        });
    }
};
MovieRepository = __decorate([
    inversify_1.injectable(),
    __param(0, decorators_1.dbClient),
    __metadata("design:paramtypes", [Object])
], MovieRepository);
exports.MovieRepository = MovieRepository;
//# sourceMappingURL=movie_repository.js.map