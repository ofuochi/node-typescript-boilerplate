import { Actor } from "../model/actor";
import { Director } from "../model/director";
import { Movie } from "../model/movie";
import { User } from "../model/user";
import { IBaseRepository } from "../interfaces/repositories";

export type Query<T> = {
    [P in keyof T]?: T[P] | { $regex: RegExp };
};

export interface IBaseRepository<T> {
    save(doc: T): Promise<T>;
    findAll(): Promise<T[]>;
    findById(id: string): Promise<T>;
    findManyById(ids: string[]): Promise<T[]>;
    findManyByQuery(query?: Query<T>): Promise<T[]>;
}

export type IMovieRepository = IBaseRepository<Movie>;
export type IActorRepository = IBaseRepository<Actor>;
export type IDirectorRepository = IBaseRepository<Director>;
export type IUserRepository = IBaseRepository<User>;
