import { HttpModule, Module } from "@nestjs/common";
import { ConfigModule } from "../config/config.module";
import { TravelPackageController } from "./travel-package.controller";
import { TravelPackageService } from "./travel-package.service";

@Module({
	imports: [ConfigModule, HttpModule],
	exports: [TravelPackageService],
	providers: [TravelPackageService],
	controllers: [TravelPackageController]
})
export class TravelPackageModule {}
