import { Tenant } from "../model/tenant";
import { User } from "../model/user";

export type Query<T> = {
    [P in keyof T]?: T[P] | { $regex: RegExp };
};

export interface IBaseRepository<T> {
    insertOrUpdate(doc: T): Promise<T>;
    findAll(): Promise<T[]>;
    findById(id: string): Promise<T>;
    hardFindById(id: string): Promise<T>;
    findManyById(ids: string[]): Promise<T[]>;
    findOneByQuery(query: Query<T>): Promise<T>;
    findOneByQuery(query: Query<{ [key: string]: any }>): Promise<T>;
    findManyByQuery(query?: Query<{ [key: string]: any }>): Promise<T[]>;
    findManyByQuery(query?: Query<T>): Promise<T[]>;
    deleteById(id: string): Promise<boolean>;
    insertMany(entities: T[]): Promise<void>;
    pagedFindAll({
        searchStr,
        skip,
        limit
    }: {
        searchStr?: string;
        skip?: number;
        limit?: number;
    }): Promise<{
        totalCount: number;
        items: T[];
    }>;
    // deleteOneByQuery(query: Query<T>): Promise<number>;
    // deleteManyByQuery(query?: Query<T>): Promise<number>;
}

export interface IUserRepository extends IBaseRepository<User> {
    findOneByQueryAndUpdate(
        query: Query<{ [key: string]: object }>,
        update: { [key: string]: object }
    ): Promise<User>;
}
export type ITenantRepository = IBaseRepository<Tenant>;
