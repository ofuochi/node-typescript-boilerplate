export default interface IBaseRepo<T> {
    create(entity: T): Promise<T>;
    update(entity: T): Promise<T>;
    getAll(): Promise<T[]>;
    getOneById(id: string | number): Promise<T>;
}
