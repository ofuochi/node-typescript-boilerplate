import { Tenant } from "../model/tenant";
import { User } from "../model/user";

export type Query<T> = {
    [P in keyof T]?: T[P] | { $regex: RegExp } | { [key: string]: any };
};

export interface IBaseRepository<T> {
    insertOrUpdate(doc: T): Promise<T>;
    findAll(): Promise<T[]>;
    findById(id: string): Promise<T>;
    hardFindById(id: string): Promise<T>;
    findManyById(ids: string[]): Promise<T[]>;
    findOneByQuery(query: Query<T>): Promise<T>;
    findManyByQuery(query?: Query<T>): Promise<T[]>;
    pagedFindAll({
        limit,
        skip,
        searchStr,
        isDeleted
    }: {
        limit?: number;
        skip?: number;
        searchStr?: string;
        isDeleted?: boolean;
    }): Promise<{
        count: number;
        items: T[];
    }>;
    deleteById(id: string): Promise<boolean>;
    findOneByQueryAndUpdate(
        query: Query<any>,
        update: { [key: string]: object }
    ): Promise<T>;
    // deleteOneByQuery(query: Query<T>): Promise<number>;
    // deleteManyByQuery(query?: Query<T>): Promise<number>;
}

export type IUserRepository = IBaseRepository<User>;
export type ITenantRepository = IBaseRepository<Tenant>;
