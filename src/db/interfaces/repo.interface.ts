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
	 * Returns a document with the given id in the collection
	 *
	 * @param {string} id
	 * @returns {Promise<T>}
	 * @memberof IBaseRepository
	 */
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
	 * Inserts multiple entities at once.
	 *
	 * @param {T[]} entities
	 * @returns {Promise<void>}
	 * @memberof IBaseRepository
	 */
	insertMany(entities: T[]): Promise<void>;
	/**
	 * Returns a paginated list of documents that satisfy the paged query.
	 *
	 * @param {{
	 *         searchStr?: string;
	 *         skip?: number;
	 *         limit?: number;
	 *     }} {
	 *         searchStr,
	 *         skip, [default 0]
	 *         limit [default 50]
	 *     }
	 * @returns {Promise<{
	 *         totalCount: number;
	 *         items: T[];
	 *     }>}
	 * @memberof IBaseRepository
	 */
	pagedFindAll({
		searchStr,
		skip,
		limit
	}: {
		searchStr?: string;
		skip: number;
		limit: number;
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
	deleteById(id: string): Promise<void>;
	deleteOneByQuery(query: Query<T>): Promise<void>;
	// deleteManyByQuery(query?: Query<T>): Promise<number>;
}
