import http from "http";
import { plainToClass } from "class-transformer";
import httpStatus from "http-status-codes";
import { inject } from "inversify";
import { Body, Delete, Get, Post, Route, Security, Tags, Response } from "tsoa";
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

    @Get("{tenantName}")
    public async get(tenantName: string): Promise<TenantDto> {
        const tenant = await this._tenantService.get(tenantName);
        if (!tenant) throw new HttpError(httpStatus.NOT_FOUND);
        return tenant;
    }
    @Post()
    @Security("X-Auth-Token", ["admin"])
    @Response(httpStatus.FORBIDDEN, http.STATUS_CODES[httpStatus.FORBIDDEN])
    public async create(@Body() input: CreateTenantInput) {
        await this.checkBadRequest(plainToClass(CreateTenantInput, input));
        await this.checkConflict(await this._tenantService.get(input.name));
        return this._tenantService.create(input.name, input.description);
    }
    @Delete("{id}")
    @Security("X-Auth-Token", ["admin"])
    public async delete(id: string): Promise<void> {
        if (!isIdValid(id))
            throw new HttpError(
                httpStatus.BAD_REQUEST,
                `ID "${id}" is invalid`
            );

        const isDeleted = await this._tenantService.delete(id);
        if (!isDeleted) this.setStatus(httpStatus.NOT_FOUND);
    }
}
