import { instanceMethod, pre, prop, Ref, Typegoose } from "@hasezoey/typegoose";
import { Expose } from "class-transformer";
import { Query } from "mongoose";
import { iocContainer } from "../../infrastructure/config/ioc";
import { DecodedJwt } from "../../ui/services/auth_service";
import { TYPES } from "../constants/types";
import { Writable } from "../utils/writable";
import { User } from "./user";

/**
 * Base entity from which other entities inherit
 *
 * @export
 * @abstract
 * @class BaseEntity
 * @extends {Typegoose}
 */
// eslint-disable-next-line
@pre<BaseEntity>("findOneAndUpdate", function(this: Query<BaseEntity>, next) {
    try {
        const entity = this.getUpdate();
        if (iocContainer.isBound(TYPES.DecodedJwt)) {
            const currentUser = iocContainer.get<DecodedJwt>(TYPES.DecodedJwt);
            entity.updatedBy = currentUser.userId;
            if (entity.isDeleted) {
                entity.deletedBy = currentUser.userId;
                entity.deletionTime = new Date();
            }
        }

        next();
    } catch (error) {
        next(error);
    }
})
// eslint-disable-next-line
@pre<any>("save", function(next) {
    try {
        if (iocContainer.isBound(TYPES.DecodedJwt)) {
            const currentUser = iocContainer.get<DecodedJwt>(TYPES.DecodedJwt);
            (this as Writable<
                BaseEntity
            >).createdBy = currentUser.userId as any;
            if (this.type === "User" && !this.tenant)
                this.setTenant(currentUser.tenantId);
        } else if (this.type === "User") {
            (this as Writable<BaseEntity>).createdBy = this;
        }
        next();
    } catch (error) {
        next(error);
    }
})
export abstract class BaseEntity extends Typegoose {
    abstract type: string;
    abstract update(entity: Partial<BaseEntity>): void;

    /**
     * Gets the primary key
     *
     * @type {*}
     * @memberof BaseEntity
     */
    @Expose()
    id?: any;

    /**
     * Gets the date and time the entity was created
     *
     * @type {Date}
     * @memberof BaseEntity
     */
    @Expose()
    @prop({ required: true, default: new Date() })
    readonly createdAt: Date = new Date();
    /**
     * Gets a reference to the user who added this entity
     *
     * @type {(Ref<User | null>)}
     * @memberof BaseEntity
     */
    @Expose()
    @prop({ default: null, ref: BaseEntity })
    readonly createdBy: Ref<User | null> = null;
    /**
     * Gets the date and time the entity was last updated
     *
     * @type {Date}
     * @memberof BaseEntity
     */
    @Expose()
    @prop({ default: null })
    readonly updatedAt?: Date;
    /**
     * Gets a reference to the user who performed the last update on this entity
     *
     * @type {(Ref<User | null>)}
     * @memberof BaseEntity
     */
    @Expose()
    @prop({ default: null, ref: BaseEntity })
    readonly updatedBy: Ref<User | null> = null;
    /**
     * Gets the entity's active status
     *
     * @type {boolean}
     * @memberof BaseEntity
     */
    @Expose()
    @prop({ required: true, default: true })
    readonly isActive: boolean = true;
    /**
     * Specifies whether the entity has been soft-deleted
     *
     * @type {boolean}
     * @memberof BaseEntity
     */
    @Expose()
    @prop({ required: true, default: false })
    readonly isDeleted: boolean = false;
    /**
     * Gets a reference to the user who deleted this entity if the entity has been soft-deleted
     *
     * @type {(Ref<User | null>)}
     * @memberof BaseEntity
     */
    @Expose()
    @prop({ default: null, ref: BaseEntity })
    readonly deletedBy: Ref<User | null> = null;
    /**
     * Gets time the entity was deleted if it has been deleted
     *
     * @type {Date}
     * @memberof BaseEntity
     */
    @Expose()
    @prop({ default: null })
    readonly deletionTime?: Date;

    /**
     * Sets {isDeleted} to true
     *
     * @memberof BaseEntity
     */
    @instanceMethod
    delete(): void {
        (this as Writable<BaseEntity>).isDeleted = true;
    }

    /**
     * Sets {isDeleted} to false
     *
     * @memberof BaseEntity
     */
    @instanceMethod
    restore(): void {
        (this as Writable<BaseEntity>).isDeleted = false;
    }

    /**
     * Sets {isActive} to true
     *
     * @memberof BaseEntity
     */
    @instanceMethod
    deactivate(): void {
        (this as Writable<BaseEntity>).isActive = false;
    }

    /**
     * Sets isActive to false
     *
     * @memberof BaseEntity
     */
    @instanceMethod
    activate(): void {
        (this as Writable<BaseEntity>).isActive = true;
    }
}
