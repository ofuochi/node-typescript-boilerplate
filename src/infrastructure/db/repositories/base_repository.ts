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
            this.Model.find(query, "-__v", (err, res) => {
                if (err) return reject(err);
                const results = res.map(r => this.readMapper(r));
                return resolve(results);
            });
        });
    }
    public async pagedFindAll({
        searchStr,
        skip,
        limit
    }: {
        searchStr?: string;
        skip?: number;
        limit?: number;
    }) {
        const query = JSON.parse(
            JSON.stringify({
                $text: { $search: searchStr },
                isDeleted: { $ne: true },
                tenant: this.getCurrentTenant()
            })
        );
        if (!Object.keys(query.$text).length) delete query.$text;

        skip = !skip || skip < 0 ? 0 : Math.floor(skip);
        limit = !limit || limit < 0 ? 0 : Math.floor(limit);
        try {
            const [totalCount, res] = await Promise.all([
                this.Model.find()
                    .countDocuments()
                    .exec(),
                this.Model.find(query, "-__v")
                    .sort("-createdAt")
                    .skip(skip)
                    .limit(limit || 50)
                    .$where((res: any) => {
                        console.log(res);
                    })
                    .exec()
            ]);
            const items = res.map(r => this.readMapper(r));
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
            this.Model.findOne(query, "-__v", (err, res) => {
                if (err) return reject(err);
                if (!res) return resolve();
                resolve(this.readMapper(res));
            });
        });
    }
    hardFindById(id: string): Promise<TEntity> {
        return new Promise<TEntity>((resolve, reject) => {
            this.Model.findById(id, (err, res) => {
                if (err) return reject(err);
                if (!res) return resolve();

                const result = this.readMapper(res);
                return resolve(result);
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
                const results = res.map(r => this.readMapper(r));
                resolve(results);
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
            this.Model.find(query, "-__v", (err, res) => {
                if (err) return reject(err);
                if (!res) return resolve();
                const result = res.map(r => this.readMapper(r));
                resolve(result);
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
            this.Model.findOne(query, "-__v", (err, res) => {
                if (err) return reject(err);
                if (!res) return resolve();
                resolve(this.readMapper(res));
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
                    const result = this.readMapper(res);
                    return resolve(result);
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
    private readMapper(model: TModel): TEntity {
        const obj: any = model.toJSON();
        const entity = this._constructor();
        const propDesc = Object.getOwnPropertyDescriptor(
            obj,
            "_id"
        ) as PropertyDescriptor;
        Object.defineProperty(obj, "id", propDesc);
        delete obj._id;
        return plainToClassFromExist(entity, obj);
    }
    private getCurrentTenant() {
        return this._constructor().type !== "Tenant"
            ? iocContainer.get<any>(TYPES.TenantId)
            : undefined;
    }
    // #endregion
}
