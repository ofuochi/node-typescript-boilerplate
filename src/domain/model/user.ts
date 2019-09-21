import { Typegoose } from "@hasezoey/typegoose";

export class User extends Typegoose {
    id?: any;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    roles: string[];
}
