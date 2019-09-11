import crypto from "crypto";
export default abstract class BaseEntity {
    private _id: string = crypto.randomBytes(4 * 4).toString("base64");
    public get id(): string {
        return this._id;
    }

    private readonly _createdAt: Date = new Date();
    protected get createdAt(): Date {
        return this._createdAt;
    }

    private _createdBy?: string;
    protected get createdBy(): string | undefined {
        return this._createdBy;
    }
    protected set createdBy(v: string | undefined) {
        this._createdBy = v;
    }

    private _isActive: boolean = true;
    protected get isActive(): boolean {
        return this._isActive;
    }
    protected set isActive(v: boolean) {
        this._isActive = v;
    }

    private _updatedAt?: Date;
    protected get updatedAt(): Date | undefined {
        return this._updatedAt;
    }
    protected set updatedAt(v: Date | undefined) {
        this._updatedAt = v;
    }

    private _updatedBy?: string;
    protected get updatedBy(): string | undefined {
        return this._updatedBy;
    }
    protected set updatedBy(v: string | undefined) {
        this._updatedBy = v;
    }

    private _deletedAt?: Date;
    protected get deletedAt(): Date | undefined {
        return this._deletedAt;
    }
    protected set deletedAt(v: Date | undefined) {
        this._deletedAt = v;
    }

    private _deletedBy?: string;
    protected get deletedBy(): string | undefined {
        return this._deletedBy;
    }
    protected set deletedBy(v: string | undefined) {
        this._deletedBy = v;
    }

    private _isDeleted: boolean = false;
    protected get isDeleted(): boolean {
        return this._isDeleted;
    }
    protected set isDeleted(v: boolean) {
        this._isDeleted = v;
    }

    // #region Modifiers
    setAsActive = (): void => {
        this._isActive = true;
    };
    setAsInactive = (): void => {
        this._isActive = false;
    };
    setAsDeleted = (): void => {
        this.isDeleted = true;
    };
    setAsNotDeleted = (): void => {
        this.isDeleted = false;
    };
    // #endregion

    // #region Helper Methods
    protected titleCase = (str: string): string => {
        return str
            .toLowerCase()
            .split(" ")
            .map(word => {
                return word.replace(word[0], word[0].toUpperCase());
            })
            .join("");
    };
    // #endregion
}
