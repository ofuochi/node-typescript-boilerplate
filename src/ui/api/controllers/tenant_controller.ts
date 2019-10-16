// import { plainToClass } from "class-transformer";
// import httpStatus from "http-status-codes";
// import { inject } from "inversify";
// import { Body, Get, Post, Query, Route, Security, Tags } from "tsoa";
// import { provideSingleton } from "../../../infrastructure/config/ioc";
// import { HttpError } from "../../error";
// import { ITenantService } from "../../interfaces/tenant_service";
// import { CreateTenantDto, TenantDto } from "../../models/tenant_dto";
// import { TenantService } from "../../services/tenant_service";
// import { BaseController } from "./base_controller";

// @Tags("Tenants")
// @Route("tenants")
// @provideSingleton(TenantController)
// export class TenantController extends BaseController {
//     @inject(TenantService) private readonly _tenantService: ITenantService;

//     @Get()
//     public async get(@Query("name") tenantName?: string): Promise<TenantDto[]> {
//         return this._tenantService.search(tenantName);
//     }
//     @Post()
//     @Security("x-auth-token")
//     public async post(@Body() input: CreateTenantDto) {
//         await this.checkBadRequest(plainToClass(CreateTenantDto, input));
//         const existing = await this._tenantService.get(input.name);
//         if (existing) throw new HttpError(httpStatus.CONFLICT);
//         return this._tenantService.create(input.name, input.description);
//     }
//     // @Delete("/:id", authMiddleware({ role: UserRole.ADMIN }))
//     // public async deleteById(@Param("id") input: string) {
//     //     if (!isIdValid(input))
//     //         throw new HttpError(
//     //             httpStatus.BAD_REQUEST,
//     //             `ID "${input}" is invalid`
//     //         );
//     //     await this._tenantService.delete(input);
//     // }
// }
