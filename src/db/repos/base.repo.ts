import { injectable, unmanaged } from "inversify";
import { Typegoose } from "typegoose";
import IBaseRepo from "../../core/services/interfaces/repo/IBaseRepo";
import IEntityDataMapper from "../../core/services/interfaces/IEntityDataMapper";

@injectable()
export class BaseRepo<TEntity, TDalEntity> implements IBaseRepo<TEntity> {
    private readonly _repo: Typegoose;
    private readonly _dataMapper: IEntityDataMapper<TEntity, TDalEntity>;
    constructor(
        @unmanaged() repo: Typegoose,
        @unmanaged() dataMapper: IEntityDataMapper<TEntity, TDalEntity>
    ) {
        this._repo = repo;
        this._dataMapper = dataMapper;
    }
    async create(entity: TEntity): Promise<TEntity> {
        const foo = this._repo.getModelForClass<TEntity>(entity);

        throw new Error("Method not implemented.");
    }
    update(entity: TEntity): Promise<TEntity> {
        throw new Error("Method not implemented.");
    }
    getAll(): Promise<TEntity[]> {
        throw new Error("Method not implemented.");
    }
    getOneById(id: string | number): Promise<TEntity> {
        throw new Error("Method not implemented.");
    }
}
