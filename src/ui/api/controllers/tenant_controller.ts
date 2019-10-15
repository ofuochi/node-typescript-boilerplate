import { plainToClass } from "class-transformer";
import httpStatus from "http-status-codes";
import { inject } from "inversify";
import {
    controller,
    httpDelete,
    httpGet,
    httpPost,
    queryParam,
    requestBody,
    requestParam
} from "inversify-express-utils";
import { UserRole } from "../../../domain/model/user";
import { isIdValid } from "../../../infrastructure/utils/server_utils";
import { HttpError } from "../../error";
import { ITenantService } from "../../interfaces/tenant_service";
import { CreateTenantDto, TenantDto } from "../../models/tenant_dto";
import { TenantService } from "../../services/tenant_service";
import { authMiddleware } from "../middleware/auth_middleware";
import { BaseController } from "./base_controller";

@controller("/tenants")
export class TenantController extends BaseController {
    constructor(
        @inject(TenantService) private readonly _tenantService: ITenantService
    ) {
        super();
    }

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
    public async post(@requestBody() input: CreateTenantDto) {
        /* For some strange reason, "input" is not not a real instance of CreateTenantInput.
          Calling the method plainToClass does the trick 🙂 */
        input = plainToClass(CreateTenantDto, input);
        await this.checkBadRequest(input);
        const existing = await this._tenantService.get(input.name);
        if (existing) throw new HttpError(httpStatus.CONFLICT);
        return this._tenantService.create(input.name, input.description);
    }
    @httpDelete("/:id", authMiddleware({ role: UserRole.ADMIN }))
    public async deleteById(@requestParam("id") input: string) {
        if (!isIdValid(input))
            throw new HttpError(
                httpStatus.BAD_REQUEST,
                `ID "${input}" is invalid`
            );
        await this._tenantService.delete(input);
    }
}
