import {
    controller,
    httpGet,
    queryParam,
    interfaces,
    requestBody,
    requestParam
} from "inversify-express-utils";

import { tenantRepository } from "../../../domain/constants/decorators";
import { ITenantRepository } from "../../../domain/interfaces/repositories";

@controller("/tenants")
export class TenantController implements interfaces.Controller {
    @tenantRepository public _tenantRepository: ITenantRepository;

    @httpGet("/")
    public async get(@queryParam("name") tenantName?: string) {
        if (!tenantName) return await this._tenantRepository.findAll();
        return await this._tenantRepository.findOneByQuery({
            name: tenantName
        });
    }
}
