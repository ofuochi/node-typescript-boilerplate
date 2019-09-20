import { injectable } from "inversify";
import { Document } from "mongoose";
import { DbClient } from "../db_client";
import { dbClient } from "../../../domain/constants/decorators";
import { BaseRepository } from "./base_repository";
import { Actor } from "../../../domain/model/actor";
import { IActorRepository } from "../../../domain/interfaces/repositories";

export interface ActorModel extends Actor, Document {}

@injectable()
export class ActorRepository extends BaseRepository<Actor, ActorModel>
    implements IActorRepository {
    public constructor(@dbClient dbClient: DbClient) {
        super(dbClient, "Actors", {
            name: String,
            yearBorn: Number,
            nationality: String,
            movies: [String]
        });
    }
}
