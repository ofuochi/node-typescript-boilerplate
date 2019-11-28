import { plainToClassFromExist } from "class-transformer";
import { Request } from "express";
import { Document, Model } from "mongoose";

import { Inject, Injectable, Logger, Scope } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";

import { headerConstants } from "../../auth/constants/header.constant";
import { BaseEntity } from "../../shared/entities/base.entity";
import { IBaseRepository, Query } from "../interfaces/repo.interface";

@Injectable({ scope: Scope.REQUEST })
export class BaseRepository<TEntity extends BaseEntity, TModel extends Document>
	implements IBaseRepository<TEntity> {
	protected Model: Model<TModel>;
	protected _ctor: () => TEntity;
	@Inject(REQUEST)
	private readonly _req: Request;
	public constructor(model: Model<TModel>, ctor: () => TEntity) {
		this.Model = model;
		this._ctor = ctor;
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
				if (err) {
					return reject(err);
				}
				return resolve(this.readMapper(res) as TEntity[]);
			});
		});
	}
	public async pagedFindAll({
		limit,
		skip,
		search
	}: {
		limit: number;
		skip: number;
		search?: string;
	}) {
		const query = JSON.parse(
			JSON.stringify({
				$text: { $search: search },
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
			Logger.error(error);
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
				if (err) {
					return reject(err);
				}
				if (!res) {
					return resolve();
				}
				resolve(this.readMapper(res) as TEntity);
			});
		});
	}

	public async insertOrUpdate(entity: TEntity): Promise<TEntity> {
		const currentUser = this.getCurrentUser();
		return new Promise<TEntity>((resolve, reject) => {
			if (entity.id) {
				const instance = new this.Model(entity);
				instance.set("updatedBy", currentUser || entity.id);
				const doc = this.readMapper(instance);
				this.Model.findByIdAndUpdate(entity.id, doc, (err, res) => {
					if (err) return reject(err);
					resolve(doc as TEntity);
				});
			} else {
				if ("tenant" in this._ctor()) {
					entity = { ...entity, tenant: this.getCurrentTenant() };
				}
				const instance = new this.Model(entity);
				instance.set("createdBy", currentUser || instance._id);

				instance.save((err, res) => {
					if (err) return reject(err);
					Object.assign(entity, this.readMapper(res));

					resolve(entity);
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
			Logger.error(error);
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
				if (err) {
					return reject(err);
				}
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
				if (err) {
					return reject(err);
				}
				if (!res) {
					return resolve();
				}
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
				if (err) {
					return reject(err);
				}
				if (!res) {
					return resolve();
				}
				resolve(this.readMapper(res) as TEntity);
			});
		});
	}
	async deleteById(id: string): Promise<void> {
		const currentUser = await this.getCurrentUser();
		const deleteQuery = JSON.parse(
			JSON.stringify({
				$set: { isDeleted: true, deletedBy: currentUser, deletedAt: new Date() }
			})
		);
		await this.findOneByQueryAndUpdate({ _id: id }, deleteQuery);
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
			this.Model.findOneAndUpdate(query, update, { new: true }, (err, res) => {
				if (err) {
					return reject(err);
				}
				if (!res) {
					return resolve();
				}
				return resolve(this.readMapper(res) as TEntity);
			});
		});
	}

	async deleteOneByQuery(query: Query<TEntity>): Promise<void> {
		query = JSON.parse(
			JSON.stringify({
				...query,
				isDeleted: { $ne: true },
				tenant: this.getCurrentTenant()
			})
		);
		await this.findOneByQueryAndUpdate(query, { $set: { isDeleted: true } });
	}

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
	protected readMapper = (model: TModel | TModel[]): TEntity | TEntity[] => {
		if (Array.isArray(model)) {
			const entities: TEntity[] = [];

			return plainToClassFromExist(entities, model);
		}
		const entity: TEntity = this._ctor();

		return plainToClassFromExist(entity, model.toJSON());
	};
	protected getCurrentTenant() {
		if (!("tenant" in this._ctor())) return undefined;
		let tenant = this._req && this._req.header(headerConstants.tenantIdKey);
		return !!tenant ? tenant : undefined;
	}
	protected getCurrentUser() {
		const user = this._req.user as any;
		return user && user.userId;
	}
	// #endregion
}
