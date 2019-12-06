import { Controller, Get, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { TravelPackageService } from "./travel-package.service";

@Controller("travel-packages")
@ApiTags("Travel-Packages")
export class TravelPackageController {
	/**
	 *
	 */
	constructor(private readonly _travelPackageService: TravelPackageService) {}
	@Get()
	getPackages() {
		return this._travelPackageService.getAll(200, 0);
	}

	@Get(":id")
	getPackage(@Param("id") id: string) {
		return this._travelPackageService.get(id);
	}
}
