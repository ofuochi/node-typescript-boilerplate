import { Tenant } from "../model/tenant";
import { User } from "../model/user";

export type Query<T> = {
    [P in keyof T]?: T[P] | { $regex: RegExp };
};

export interface IBaseRepository<T> {
    save(doc: T): Promise<T>;
    findAll(): Promise<T[]>;
    findById(id: string): Promise<T>;
    findManyById(ids: string[]): Promise<T[]>;
    findOneByQuery(query: Query<T>): Promise<T>;
    findManyByQuery(query?: Query<T>): Promise<T[]>;
    deleteById(id: string): Promise<boolean>;
    // deleteOneByQuery(query: Query<T>): Promise<number>;
    // deleteManyByQuery(query?: Query<T>): Promise<number>;
}

export type IUserRepository = IBaseRepository<User>;
export type ITenantRepository = IBaseRepository<Tenant>;
