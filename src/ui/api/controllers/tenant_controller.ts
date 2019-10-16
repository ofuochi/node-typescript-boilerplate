import { plainToClass } from "class-transformer";
import httpStatus from "http-status-codes";
import { inject } from "inversify";
import { Body, Delete, Get, Post, Query, Route, Security, Tags } from "tsoa";
import { provideSingleton } from "../../../infrastructure/config/ioc";
import { isIdValid } from "../../../infrastructure/utils/server_utils";
import { HttpError } from "../../error";
import { ITenantService } from "../../interfaces/tenant_service";
import { CreateTenantInput, TenantDto } from "../../models/tenant_dto";
import { TenantService } from "../../services/tenant_service";
import { BaseController } from "./base_controller";

@Tags("Tenants")
@Route("tenants")
@provideSingleton(TenantController)
export class TenantController extends BaseController {
    @inject(TenantService) private readonly _tenantService: ITenantService;

    @Get()
    public async get(@Query("name") tenantName?: string): Promise<TenantDto[]> {
        return this._tenantService.search(tenantName);
    }
    @Post()
    @Security("X-Auth-Token", ["admin"])
    public async create(@Body() input: CreateTenantInput) {
        await this.checkBadRequest(plainToClass(CreateTenantInput, input));
        const existing = await this._tenantService.get(input.name);
        if (existing) {
            this.setStatus(httpStatus.CONFLICT);
            throw new HttpError(httpStatus.CONFLICT);
        }
        return this._tenantService.create(input.name, input.description);
    }
    @Delete("{id}")
    @Security("X-Auth-Token", ["admin"])
    public async delete(id: string) {
        if (!isIdValid(id))
            throw new HttpError(
                httpStatus.BAD_REQUEST,
                `ID "${id}" is invalid`
            );
        await this._tenantService.delete(id);
    }
}
