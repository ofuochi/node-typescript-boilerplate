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
import { CreateTenantInput, TenantDto } from "../../models/tenant_dto";
import { TenantService } from "../../services/tenant_service";
import { authMiddleware } from "../middleware/auth_middleware";
import { BaseController } from "./base_controller";

@controller("/tenants")
export class TenantController extends BaseController {
    @inject(TenantService) private readonly _tenantService: ITenantService;

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
        await this.checkBadRequest(plainToClass(CreateTenantInput, input));
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
