import { plainToClass } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import http from "http";
import httpStatus from "http-status-codes";
import { inject } from "inversify";
import {
    Body,
    Controller,
    Get,
    Post,
    Query,
    Response,
    Route,
    Security,
    Tags
} from "tsoa";
import { provideSingleton } from "../../../infrastructure/config/ioc";
import { HttpError } from "../../error";
import { ITenantService } from "../../interfaces/tenant_service";
import { BaseCreateEntityDto } from "../../models/base_dto";
import { CreateTenantDto, TenantDto } from "../../models/tenant_dto";
import { TenantService } from "../../services/tenant_service";

@Route("foos")
@Tags("Foos")
// eslint-disable-next-line
@provideSingleton(FooController)
export class FooController extends Controller {
    @inject(TenantService) private _tenantService: ITenantService;

    @Get()
    @Response("400", "Bad request")
    public async get(@Query() tenantName?: string): Promise<TenantDto[]> {
        return this._tenantService.search(tenantName);
    }

    @Post()
    @Security({ jwt: ["admin"], "X-Tenant-Id": [] })
    @Response(httpStatus.CONFLICT, http.STATUS_CODES[httpStatus.CONFLICT])
    @Response(httpStatus.FORBIDDEN, http.STATUS_CODES[httpStatus.FORBIDDEN])
    @Response(httpStatus.BAD_REQUEST, http.STATUS_CODES[httpStatus.BAD_REQUEST])
    public async create(@Body() input: CreateTenantDto): Promise<TenantDto> {
        input = plainToClass(CreateTenantDto, input);
        const badRequest = await this.checkBadRequest(input);
        if (badRequest) {
            this.setStatus(httpStatus.BAD_REQUEST);
            throw new HttpError(httpStatus.BAD_REQUEST, badRequest);
        }

        const existing = await this._tenantService.get(input.name);
        if (existing) {
            this.setStatus(httpStatus.CONFLICT);
            throw new HttpError(httpStatus.CONFLICT);
        }
        return this._tenantService.create(input.name, input.description);
    }
    private async checkBadRequest(input: BaseCreateEntityDto) {
        const errors = await validate(input);
        if (errors.length > 0) {
            return errors
                .map((error: ValidationError) => error.constraints)
                .map(err => Object.values(err)[0])
                .join(", ");
        }
    }
}
