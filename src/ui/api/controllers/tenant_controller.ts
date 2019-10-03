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
import { UserRole } from "../../../domain/model/user";
import { CreateTenantInput, TenantDto } from "../../models/tenant_dto";
import { authMiddleware } from "../middleware/auth_middleware";
import { BaseController } from "./base_controller";

@controller("/tenants")
export class TenantController extends BaseController {
    @tenantRepository public _tenantRepository: ITenantRepository;

    /**
     * Returns a list of TenantDto
     *
     * @param {string} [tenantName]
     * @returns {Promise<TenantDto[]>}
     * @memberof TenantController
     */
    @httpGet("/")
    public async get(
        @queryParam("name") tenantName?: string
    ): Promise<TenantDto[]> {
        const tenants = tenantName
            ? await this._tenantRepository.findManyByQuery({
                  name: tenantName
              })
            : await this._tenantRepository.findAll();

        return tenants.map(t => {
            let tenantDto: TenantDto = {
                name: t.name,
                description: t.description,
                isActive: t.isActive,
                id: t.id
            };
            return tenantDto;
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
