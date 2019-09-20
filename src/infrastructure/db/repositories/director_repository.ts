import { injectable } from "inversify";
import { Document } from "mongoose";
import { DbClient } from "../db_client";
import { dbClient } from "../../../domain/constants/decorators";
import { BaseRepository } from "./base_repository";
import { Director } from "../../../domain/model/director";
import { IDirectorRepository } from "../../../domain/interfaces/repositories";

export interface DirectorModel extends Director, Document {}

@injectable()
export class DirectorRepository extends BaseRepository<Director, DirectorModel>
    implements IDirectorRepository {
    public constructor(@dbClient dbClient: DbClient) {
        super(dbClient, "Directors", {
            name: String,
            yearBorn: Number,
            nationality: String,
            movies: [String]
        });
    }
}
