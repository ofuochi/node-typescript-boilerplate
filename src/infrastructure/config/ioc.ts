import {
    autoProvide,
    fluentProvide,
    provide
} from "inversify-binding-decorators";
import { Container, interfaces, inject } from "inversify";

const iocContainer = new Container();

const provideNamed = (
    identifier:
        | string
        | symbol
        | interfaces.Newable<any>
        | interfaces.Abstract<any>,
    name: string
) =>
    fluentProvide(identifier)
        .whenTargetNamed(name)
        .done();

const provideSingleton = (
    identifier:
        | string
        | symbol
        | interfaces.Newable<any>
        | interfaces.Abstract<any>
) =>
    fluentProvide(identifier)
        .inSingletonScope()
        .done();

export {
    iocContainer,
    autoProvide,
    provide,
    provideSingleton,
    provideNamed,
    inject
};
