import { injectable, unmanaged } from 'inversify'
import { Document, Model } from 'mongoose'

import BaseEntity from '../../../domain/model/base'
import { IBaseRepository, Query } from '../../../domain/interfaces/repositories'

@injectable()
export class BaseRepository<TEntity extends BaseEntity, TModel extends Document>
    implements IBaseRepository<TEntity> {
    protected Model: Model<TModel>;

    public constructor(@unmanaged() model: Model<TModel>) {
        this.Model = model;
    }

    // We wrap the mongoose API here so we can use async / await

    public async findAll() {
        return new Promise<TEntity[]>((resolve, reject) => {
            this.Model.find((err, res) => {
                if (err) return reject(err);
                let results = res.map(r => this._readMapper(r));
                results = results.filter(r => !r.isDeleted);
                resolve(results);
            });
        });
    }

    public async findById(id: string) {
        return new Promise<TEntity>((resolve, reject) => {
            this.Model.findById(id, (err, res) => {
                if (err) return reject(err);
                if (!res) return reject();

                const result = this._readMapper(res);
                resolve(result.isDeleted ? undefined : result);
            });
        });
    }

    public async save(doc: TEntity) {
        return new Promise<TEntity>((resolve, reject) => {
            const instance = new this.Model(doc);
            instance.save((err, res) => {
                if (err) return reject(err);
                resolve(this._readMapper(res));
            });
        });
    }

    public findManyById(ids: string[]) {
        return new Promise<TEntity[]>((resolve, reject) => {
            const query = { _id: { $in: ids } };
            this.Model.find(query, (err, res) => {
                if (err) return reject(err);
                let results = res.map(r => this._readMapper(r));
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
                let result = res.map(r => this._readMapper(r));
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
                else {
                    const result = this._readMapper(res);
                    resolve(result.isDeleted ? undefined : result);
                }
            });
        });
    }

    private _readMapper(model: TModel): TEntity {
        const obj: any = model.toJSON();
        const propDesc = Object.getOwnPropertyDescriptor(
            obj,
            "_id"
        ) as PropertyDescriptor;
        Object.defineProperty(obj, "id", propDesc);
        delete obj["_id"];
        return obj as TEntity;
    }
}
