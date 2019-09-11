import MustHaveTenantId from "./MustHaveTenantIdBase";

export enum UserRoleEnum {
    USER = 0,
    ADMIN
}

export default class User extends MustHaveTenantId {
    private _tenantId: string;
    public get tenantId(): string {
        return this._tenantId;
    }
    protected seTenantId = (v: string) => {
        if (!v) throw new Error("TenantId must be truthy");
        if (v.match(/^[a-fA-F0-9]{24}$/))
            throw new Error("TenantId is invalid");
        return v;
    };

    private _role: UserRoleEnum = UserRoleEnum.USER;
    public get role(): UserRoleEnum {
        return this._role;
    }

    private _firstName: string;
    public get firstName(): string {
        return this._firstName;
    }
    private setFirstName(v: string) {
        if (!v) throw new Error("firstName must be truthy");
        return this.titleCase(v.trim());
    }

    private _password: string;
    public get password(): string {
        return this._password;
    }
    private setPassword = (v: string): string => {
        if (!v) throw new Error("password must be truthy");
        return v;
    };

    private _lastName: string;
    public get lastName(): string {
        return this._lastName;
    }
    private setLastName(v: string) {
        if (!v) throw new Error("lastName must be truthy");
        return this.titleCase(v.trim());
    }

    private _email: string;
    public get email(): string {
        return this._email;
    }
    private setEmail = (v: string): string => {
        if (!v) throw new Error("email must be truthy");
        if (
            !v.match(
                // eslint-disable-next-line
                /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            )
        )
            throw new Error("invalid email provided");
        return v.trim().toLowerCase();
    };
    private _username: string;
    public get username(): string {
        return this._username;
    }
    private setUsername = (v: string): string => {
        if (!v) throw new Error("username must be truthy");
        return v.trim().toLowerCase();
    };
    private constructor({
        firstName,
        lastName,
        email,
        username,
        password,
        tenantId
    }: {
        firstName: string;
        lastName: string;
        email: string;
        username: string;
        tenantId: string;
        password?: string;
    }) {
        super();
        this._firstName = this.setFirstName(firstName);
        this._lastName = this.setLastName(lastName);
        this._email = this.setEmail(email);
        this._password = this.setPassword(password);
        this._username = this.setUsername(username);
        this._tenantId = this.seTenantId(tenantId);
    }

    public setRole = (userRole: UserRoleEnum): void => {
        this._role = userRole;
    };
    static createInstance = ({
        firstName,
        lastName,
        username,
        email,
        password,
        tenantId
    }: {
        firstName: string;
        lastName: string;
        email: string;
        username: string;
        tenantId: string;
        password?: string;
    }) => {
        return new User({
            firstName,
            lastName,
            email,
            username,
            password,
            tenantId
        });
    };
}
