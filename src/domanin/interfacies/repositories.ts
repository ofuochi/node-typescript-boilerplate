import User from "../models/user";

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

export type IUserRepository = IBaseRepository<User>;
