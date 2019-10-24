import { Tenant } from "../models/tenant";
import { User } from "../models/user";

export type Query<T> = {
    [P in keyof T]?: T[P] | { $regex: RegExp };
};

export interface IBaseRepository<T> {
    /**
     * Inserts the document into the database if it has no id or updates a record
     *  with the same id in the database
     * @param {T} doc the document to insert or update
     * @returns {Promise<T>}
     * @memberof IBaseRepository
     */
    insertOrUpdate(doc: T): Promise<T>;
    /**
     * Returns all documents in the collection
     *
     * @returns {Promise<T[]>}
     * @memberof IBaseRepository
     */
    findAll(): Promise<T[]>;
    /**
     * Returns a document in the collection with the given id
     *
     * @param {string} id
     * @returns {Promise<T>}
     * @memberof IBaseRepository
     */
    findById(id: string): Promise<T>;
    /**
     * Returns a document with the given id in the collection even if the document has been deleted
     *
     * @param {string} id
     * @returns {Promise<T>}
     * @memberof IBaseRepository
     */
    hardFindById(id: string): Promise<T>;
    findManyById(ids: string[]): Promise<T[]>;

    /**
     * Finds the first document that matches the supplied query in the collection
     *
     * @param {Query<T>} query
     * @returns {Promise<T>}
     * @memberof IBaseRepository
     */
    findOneByQuery(query: Query<T>): Promise<T>;
    /**
     * Finds the first document that matches the supplied query in the collection
     *
     * @param {Query<T>} query
     * @returns {Promise<T>}
     * @memberof IBaseRepository
     */
    findOneByQuery(query: Query<{ [key: string]: any }>): Promise<T>;
    /**
     * Finds all documents that matches the supplied query in the collection
     *
     * @param {Query<{ [key: string]: any }>} query
     * @returns {Promise<T[]>}
     * @memberof IBaseRepository
     */
    findManyByQuery(query?: Query<{ [key: string]: any }>): Promise<T[]>;
    /**
     * Finds all documents that matches the supplied query in the collection
     *
     * @param {Query<{ [key: string]: any }>} query
     * @returns {Promise<T[]>}
     * @memberof IBaseRepository
     */
    findManyByQuery(query?: Query<T>): Promise<T[]>;
    /**
     * Returns a paginated list of all documents that matches the supplied search string, if any, in the collection
     * as well as the total count in the database
     *
     * @param {Query<{ [key: string]: any }>} query
     * @returns {Promise<T[]>}
     * @memberof IBaseRepository
     */
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
    /**
     * Soft-deletes an element with the given id in the database
     *
     * @param {string} id
     * @returns {Promise<boolean>}
     * @memberof IBaseRepository
     */
    deleteById(id: string): Promise<boolean>;
    // deleteOneByQuery(query: Query<T>): Promise<number>;
    // deleteManyByQuery(query?: Query<T>): Promise<number>;
}

export interface IUserRepository extends IBaseRepository<User> {
    /**
     * Finds an element in the collection that matches the given query and updates the record
     * with the supplied update
     *
     * @param {Query<{ [key: string]: object }>} query
     * @param {{ [key: string]: object }} update
     * @returns {Promise<User>}
     * @memberof IUserRepository
     */
    findOneByQueryAndUpdate(
        query: Query<{ [key: string]: object }>,
        update: { [key: string]: object }
    ): Promise<User>;
}
export type ITenantRepository = IBaseRepository<Tenant>;
