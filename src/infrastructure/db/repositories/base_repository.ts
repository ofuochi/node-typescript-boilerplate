import { plainToClassFromExist } from "class-transformer";
import { unmanaged } from "inversify";
import { Document, Model } from "mongoose";
import { TYPES } from "../../../core/domain/constants/types";
import { IBaseRepository, Query } from "../../../core/domain/data/repositories";
import { BaseEntity } from "../../../core/domain/models/base";
import { iocContainer, provideSingleton } from "../../config/ioc";
import { winstonLoggerInstance } from "../../bootstrapping/loaders/logger";

@provideSingleton(BaseRepository)
export class BaseRepository<TEntity extends BaseEntity, TModel extends Document>
    implements IBaseRepository<TEntity> {
    protected Model: Model<TModel>;
    protected _constructor: () => TEntity;

    public constructor(
        @unmanaged() model: Model<TModel>,
        @unmanaged() constructor: () => TEntity
    ) {
        model.schema.set("toObject", {
            virtuals: true,
            versionKey: false,
            transform: (doc, ret) => {
                delete ret._id;
                return ret;
            }
        });
        this.Model = model;
        this._constructor = constructor;
    }

    public async findAll() {
        const query = JSON.parse(
            JSON.stringify({
                isDeleted: { $ne: true },
                tenant: this.getCurrentTenant()
            })
        );
        return new Promise<TEntity[]>((resolve, reject) => {
            this.Model.find(query, (err, res) => {
                if (err) return reject(err);
                return resolve(this.readMapper(res) as TEntity[]);
            });
        });
    }
    public async pagedFindAll({
        searchStr,
        skip,
        limit
    }: {
        searchStr?: string;
        skip: number;
        limit: number;
    }) {
        const query = JSON.parse(
            JSON.stringify({
                $text: { $search: searchStr },
                isDeleted: { $ne: true },
                tenant: this.getCurrentTenant()
            })
        );
        if (!Object.keys(query.$text).length) delete query.$text;

        skip = skip < 0 ? 0 : Math.floor(skip);
        limit = limit < 0 ? 0 : Math.floor(limit);
        try {
            const [totalCount, res] = await Promise.all([
                this.Model.find()
                    .countDocuments()
                    .exec(),
                this.Model.find(query)
                    .sort("-createdAt")
                    .skip(skip)
                    .limit(limit)
                    .exec()
            ]);
            const items = this.readMapper(res) as TEntity[];
            return { totalCount, items };
        } catch (error) {
            winstonLoggerInstance.error(error);
            throw new Error(error);
        }
    }
    public async findById(id: string) {
        const query = JSON.parse(
            JSON.stringify({
                _id: id,
                isDeleted: { $ne: true },
                tenant: this.getCurrentTenant()
            })
        );

        return new Promise<TEntity>((resolve, reject) => {
            this.Model.findOne(query, (err, res) => {
                if (err) return reject(err);
                if (!res) return resolve();
                resolve(this.readMapper(res) as TEntity);
            });
        });
    }
    hardFindById(id: string): Promise<TEntity> {
        return new Promise<TEntity>((resolve, reject) => {
            this.Model.findById(id, (err, res) => {
                if (err) return reject(err);
                if (!res) return resolve();

                return resolve(this.readMapper(res) as TEntity);
            });
        });
    }

    public async insertOrUpdate(doc: TEntity): Promise<TEntity> {
        return new Promise<TEntity>((resolve, reject) => {
            if (doc.id) {
                const query = JSON.parse(
                    JSON.stringify({
                        _id: doc.id,
                        isDeleted: { $ne: true },
                        tenant: this.getCurrentTenant()
                    })
                );
                this.Model.findByIdAndUpdate(
                    query,
                    doc,
                    { new: true },
                    (err, res) => {
                        if (err) return reject(err);
                        if (!res) return resolve();
                        Object.assign(doc, this.readMapper(res));
                        return resolve(doc);
                    }
                );
            } else {
                const instance = new this.Model(doc);
                instance.save((err, res) => {
                    if (err) return reject(err);
                    Object.assign(doc, this.readMapper(res));
                    return resolve(doc);
                });
            }
        });
    }
    public async insertMany(docs: TEntity[]): Promise<void> {
        try {
            const list = (await this.Model.insertMany(docs)) as any;
            docs.length = 0;
            [].push.apply(docs, list as TEntity[]);
        } catch (error) {
            winstonLoggerInstance.error(error);
            throw new Error(error);
        }
    }
    public findManyById(ids: string[]) {
        const query = JSON.parse(
            JSON.stringify({
                _id: { $in: ids },
                isDeleted: { $ne: true },
                tenant: this.getCurrentTenant()
            })
        );
        return new Promise<TEntity[]>((resolve, reject) => {
            this.Model.find(query, (err, res) => {
                if (err) return reject(err);
                resolve(this.readMapper(res) as TEntity[]);
            });
        });
    }

    public findManyByQuery(query: Query<TEntity>) {
        query = JSON.parse(
            JSON.stringify({
                ...query,
                isDeleted: { $ne: true },
                tenant: this.getCurrentTenant()
            })
        );
        return new Promise<TEntity[]>((resolve, reject) => {
            this.Model.find(query, (err, res) => {
                if (err) return reject(err);
                if (!res) return resolve();
                resolve(this.readMapper(res) as TEntity[]);
            });
        });
    }
    public async findOneByQuery(query: Query<TEntity>) {
        query = JSON.parse(
            JSON.stringify({
                ...query,
                isDeleted: { $ne: true },
                tenant: this.getCurrentTenant()
            })
        );
        return new Promise<TEntity>((resolve, reject) => {
            this.Model.findOne(query, (err, res) => {
                if (err) return reject(err);
                if (!res) return resolve();
                resolve(this.readMapper(res) as TEntity);
            });
        });
    }
    async deleteById(id: string): Promise<boolean> {
        const item = await this.findById(id);
        if (!item) return false;

        item.delete();
        await this.insertOrUpdate(item);
        return true;
    }

    findOneByQueryAndUpdate(
        query: Query<any>,
        update: { [key: string]: object }
    ): Promise<TEntity> {
        query = JSON.parse(
            JSON.stringify({
                ...query,
                isDeleted: { $ne: true },
                tenant: this.getCurrentTenant()
            })
        );
        return new Promise<TEntity>((resolve, reject) => {
            this.Model.findOneAndUpdate(
                query,
                update,
                { new: true },
                (err, res) => {
                    if (err) return reject(err);
                    if (!res) return resolve();
                    return resolve(this.readMapper(res) as TEntity);
                }
            );
        });
    }

    // deleteOneByQuery(query: Query<TEntity>): Promise<number> {
    //     throw new Error("Method not implemented.");
    // }
    // deleteManyByQuery(query?: Query<TEntity> | undefined): Promise<number> {
    //     throw new Error("Method not implemented.");
    // }

    // #region Helper methods
    /**
     * Maps '_id' from mongodb to 'id' of TEntity
     *
     * @private
     * @param {TModel} model
     * @returns {TEntity}
     * @memberof BaseRepository
     */
    private readMapper = (model: TModel | TModel[]): TEntity | TEntity[] => {
        if (Array.isArray(model)) {
            const entities: TEntity[] = [];

            return plainToClassFromExist(entities, model);
        }
        const entity: TEntity = this._constructor();

        return plainToClassFromExist(entity, model.toJSON());
    };
    private getCurrentTenant() {
        return this._constructor().type !== "Tenant"
            ? iocContainer.get<any>(TYPES.TenantId)
            : undefined;
    }
    // #endregion
}
