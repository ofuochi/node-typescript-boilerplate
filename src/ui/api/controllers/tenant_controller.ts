import { controller, httpGet, interfaces } from "inversify-express-utils";
import { tenantRepository } from "../../../domain/constants/decorators";
import { ITenantRepository } from "../../../domain/interfaces/repositories";

@controller("/tenants")
export class TenantController implements interfaces.Controller {
    @tenantRepository public _tenantRepository: ITenantRepository;

    @httpGet("/")
    public async get() {
        return await this._tenantRepository.findAll();
    }
}
