import { EventDispatcher } from "event-dispatch";
import { ContainerModule } from "inversify";
// Interfaces & Types
import { TYPES } from "../../domain/constants/types";

// Controllers
import "../../ui/api/controllers/auth_controller";
import "../../ui/api/controllers/tenant_controller";
import { IFunctionQuery } from "../../domain/data/function_query";
import { FunctionQuery } from "../db/function_query";

export const referenceDataIoCModule = new ContainerModule(bind => {
    bind<EventDispatcher>(TYPES.EventDispatcher).toConstantValue(
        new EventDispatcher()
    );
    bind<IFunctionQuery>(TYPES.FunctionQuery).toConstantValue(
        new FunctionQuery()
    );
});
