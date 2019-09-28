import { plainToClass } from "class-transformer";
import {
    controller,
    httpGet,
    httpPost,
    queryParam,
    requestBody
} from "inversify-express-utils";

import { tenantRepository } from "../../../domain/constants/decorators";
import { ITenantRepository } from "../../../domain/interfaces/repositories";
import Tenant from "../../../domain/model/tenant";
import { CreateTenantInput, TenantDto } from "../../models/tenant_dto";
import { BaseController } from "./base_controller";
import { authMiddleware } from "../middleware/auth_middleware";
import { UserRole } from "../../../domain/model/user";

@controller("/tenants")
export class TenantController extends BaseController {
    @tenantRepository public _tenantRepository: ITenantRepository;

    @httpGet("/")
    public async get(@queryParam("name") tenantName?: string) {
        if (!tenantName) return await this._tenantRepository.findAll();
        return await this._tenantRepository.findOneByQuery({
            name: tenantName
        });
    }
    @httpPost("/", authMiddleware({ role: UserRole.ADMIN }))
    public async post(@requestBody() input: CreateTenantInput) {
        /** For some strange reason, "input" is not not a real instance of CreateTenantInput.
         * Calling the method plainToClass does the trick 🙂*/
        input = plainToClass(CreateTenantInput, input);
        const badRequest = await this.checkBadRequest(input);

        if (badRequest) return badRequest;

        let tenant = await this._tenantRepository.findOneByQuery({
            name: input.name
        });
        if (tenant) return this.conflict();
        tenant = await this._tenantRepository.save(
            Tenant.createInstance(input.name, input.description)
        );

        const tenantDto: TenantDto = {
            name: tenant.name,
            description: tenant.description,
            isActive: tenant.isActive,
            id: tenant.id
        };
        return tenantDto;
    }
}
