import { Method } from "axios";
import { ConfigService } from "../config/config.service";

import {
	HttpService,
	Injectable,
	Logger,
	ServiceUnavailableException
} from "@nestjs/common";

@Injectable()
export class TravelPackageService {
	constructor(
		private readonly _httpService: HttpService,
		private readonly _configService: ConfigService
	) {}

	public async getAll(limit: number, page: number) {
		return await this.callTravelPackageApi("GET", "/api/travel-deals", {
			limit,
			page
		});
	}

	public async get(id: string) {
		return await this.callTravelPackageApi("GET", `/api/travel-deals/${id}`);
	}
	private async callTravelPackageApi(
		method: Method,
		url: string,
		data?: object
	) {
		try {
			const result = await this._httpService
				.request({
					baseURL: this._configService.env.packageBaseUrl,
					method,
					url,
					data
				})
				.toPromise();
			return result.data;
		} catch (error) {
			Logger.error(error);
			throw new ServiceUnavailableException();
		}
	}
}
