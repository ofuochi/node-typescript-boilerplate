import { plainToClassFromExist } from "class-transformer";
import { unmanaged } from "inversify";
import { Document, Model } from "mongoose";
import {
    IBaseRepository,
    Query
} from "../../../domain/interfaces/repositories";
import { BaseEntity } from "../../../domain/model/base";
import { provideSingleton } from "../../config/ioc";

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
        return new Promise<TEntity[]>((resolve, reject) => {
            this.Model.find({ isDeleted: { $ne: true } }, (err, res) => {
                if (err) return reject(err);
                const results = res.map(r => this.readMapper(r));
                return resolve(results);
            });
        });
    }

    public async findById(id: string) {
        return new Promise<TEntity>((resolve, reject) => {
            this.Model.findById(id, "-__v", (err, res) => {
                if (err) return reject(err);
                if (!res) return resolve();

                const result = this.readMapper(res);
                resolve(result.isDeleted ? undefined : result);
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
                this.Model.findByIdAndUpdate(
                    { _id: doc.id },
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
        return new Promise<TEntity[]>((resolve, reject) => {
            const query = { _id: { $in: ids } };
            this.Model.find(query, (err, res) => {
                if (err) return reject(err);
                let results = res.map(r => this.readMapper(r));
                results = results.filter(r => !r.isDeleted);
                resolve(results);
            });
        });
    }

    public findManyByQuery(query: Query<TEntity>) {
        return new Promise<TEntity[]>((resolve, reject) => {
            this.Model.find(query, "-__v", (err, res) => {
                if (err) return reject(err);
                if (!res) return resolve();
                let result = res.map(r => this.readMapper(r));
                result = result.filter(r => !r.isDeleted);
                resolve(result);
            });
        });
    }
    public async findOneByQuery(query: Query<TEntity>) {
        return new Promise<TEntity>((resolve, reject) => {
            this.Model.findOne(query, "-__v", (err, res) => {
                if (err) return reject(err);
                if (!res) return resolve();
                const result = this.readMapper(res);
                resolve(result.isDeleted ? undefined : result);
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
}
