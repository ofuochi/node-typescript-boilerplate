import { injectable, unmanaged } from "inversify";
import { Document, Model } from "mongoose";
import { plainToClassFromExist } from "class-transformer";

import {
    IBaseRepository,
    Query
} from "../../../domain/interfaces/repositories";
import { BaseEntity } from "../../../domain/model/base";

@injectable()
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

    // We wrap the mongoose API here so we can use async / await

    public async findAll() {
        return new Promise<TEntity[]>((resolve, reject) => {
            this.Model.find((err, res) => {
                if (err) return reject(err);
                let results = res.map(r => this.readMapper(r));
                results = results.filter(r => !r.isDeleted);
                return resolve(results);
            });
        });
    }

    public async findById(id: string) {
        return new Promise<TEntity>((resolve, reject) => {
            this.Model.findById(id, (err, res) => {
                if (err) return reject(err);
                if (!res) return reject();

                const result = this.readMapper(res);
                return resolve(result.isDeleted ? undefined : result);
            });
        });
    }

    public async save(doc: TEntity): Promise<TEntity> {
        return new Promise<TEntity>((resolve, reject) => {
            if (doc.id) {
                this.Model.updateOne(
                    { _id: doc.id },
                    doc,
                    { new: true },
                    (err, res) => {
                        if (err) return reject(err);
                        if (!res) return resolve();
                        return resolve(doc);
                    }
                );
            } else {
                const instance = new this.Model(doc);
                instance.save((err, res) => {
                    if (err) return reject(err);
                    return resolve(this.readMapper(res));
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
            this.Model.find(query as any, (err, res) => {
                if (err) return reject(err);
                if (!res) return resolve();
                let result = res.map(r => this.readMapper(r));
                result = result.filter(r => !r.isDeleted);
                resolve(result);
            });
        });
    }
    public findOneByQuery(query: Query<TEntity>) {
        return new Promise<TEntity>((resolve, reject) => {
            this.Model.findOne(query as any, (err, res) => {
                if (err) return reject(err);
                if (!res) return resolve();
                const result = this.readMapper(res);
                resolve(result.isDeleted ? undefined : result);
            });
        });
    }

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
