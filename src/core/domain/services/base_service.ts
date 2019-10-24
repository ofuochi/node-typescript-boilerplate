export interface IBaseService<T> {
    pagedGetAll({
        searchStr,
        skip,
        limit
    }: {
        searchStr?: string;
        skip?: number;
        limit?: number;
    }): Promise<{ totalCount: number; items: T[] }>;
}
