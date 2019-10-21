export interface IBaseService<T> {
    pagedGetAll(
        skipCount?: number,
        maxResultCount?: number
    ): Promise<{ count: number; items: T[] }>;
}
