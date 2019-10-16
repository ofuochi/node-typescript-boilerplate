import { EventDispatcher } from "event-dispatch";
import { ContainerModule } from "inversify";
// Interfaces & Types
import { TYPES } from "../../domain/constants/types";

// Controllers
import "../../ui/api/controllers/auth_controller";
// import "../../ui/api/controllers/tenant_controller";
import "../../ui/api/controllers/tenant1_controller";

export const referenceDataIoCModule = new ContainerModule(bind => {
    bind<EventDispatcher>(TYPES.EventDispatcher).toConstantValue(
        new EventDispatcher()
    );
});
