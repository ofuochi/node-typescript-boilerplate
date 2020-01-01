import { PackagesResponse, PackageResponse } from "./dto/TravelPackage";
import { Controller, Get, Param, Query } from "@nestjs/common";
import { ApiTags, ApiCreatedResponse } from "@nestjs/swagger";

import { TravelPackageService } from "./travel-package.service";
import { GetAllInput } from "../shared/dto/GetAll";

@Controller("travel-packages")
@ApiTags("Travel-Packages")
export class TravelPackageController {
	constructor(private readonly _travelPackageService: TravelPackageService) {}
	@Get()
	@ApiCreatedResponse({
		type: PackagesResponse
	})
	getPackages(@Query() input: GetAllInput) {
		return this._travelPackageService.getAll(input.limit, input.skip);
	}

	@Get(":id")
	@ApiCreatedResponse({
		type: PackageResponse
	})
	getPackage(@Param("id") id: string) {
		return this._travelPackageService.get(id);
	}
}
