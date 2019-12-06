import { Method } from "axios";
import { ConfigService } from "src/config/config.service";

import {
	HttpException,
	HttpService,
	HttpStatus,
	Injectable,
	Logger
} from "@nestjs/common";

@Injectable()
export class TravelPackageService {
	constructor(
		private readonly _httpService: HttpService,
		private readonly _configService: ConfigService
	) {}

	public async getAll(limit: number, page: number) {
		try {
			return await this.callTravelPackageApi("GET", "/api/travel-deals", {
				limit,
				page
			});
		} catch (error) {
			throw new HttpException(
				"An error has occurred",
				HttpStatus.FAILED_DEPENDENCY
			);
		}
	}

	public async get(id: string) {
		try {
			return await this.callTravelPackageApi("GET", `/api/travel-deals/${id}`);
		} catch (error) {
			Logger.error(error);
			throw new HttpException(
				"An error has occurred",
				HttpStatus.FAILED_DEPENDENCY
			);
		}
	}
	private async callTravelPackageApi(
		method: Method,
		url: string,
		data?: object
	) {
		const result = await this._httpService
			.request({
				baseURL: this._configService.env.packageBaseUrl,
				method,
				url,
				data
			})
			.toPromise();
		return result.data;
	}
}
