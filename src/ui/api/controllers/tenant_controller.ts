import { plainToClass } from "class-transformer";
import {
    controller,
    httpGet,
    httpPost,
    queryParam,
    requestBody
} from "inversify-express-utils";

import { tenantService } from "../../../domain/constants/decorators";
import { UserRole } from "../../../domain/model/user";
import { CreateTenantInput, TenantDto } from "../../models/tenant_dto";
import { authMiddleware } from "../middleware/auth_middleware";
import { BaseController } from "./base_controller";
import { ITenantService } from "domain/interfaces/services";

@controller("/tenants")
export class TenantController extends BaseController {
    @tenantService public _tenantService: ITenantService;

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
        const tenants = await this._tenantService.search(tenantName);
        return tenants;
    }
    @httpPost("/", authMiddleware({ role: UserRole.ADMIN }))
    public async post(@requestBody() input: CreateTenantInput) {
        /** For some strange reason, "input" is not not a real instance of CreateTenantInput.
         * Calling the method plainToClass does the trick 🙂*/
        input = plainToClass(CreateTenantInput, input);
        const badRequest = await this.checkBadRequest(input);
        if (badRequest) return badRequest;
        const existing = await this._tenantService.get(name);
        if (existing != undefined) return this.conflict();
        const tenant = await this._tenantService.create(input.name, input.description);
        return tenant;
    }
}
