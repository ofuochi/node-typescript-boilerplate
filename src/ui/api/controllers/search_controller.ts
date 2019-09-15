import { controller, httpGet, requestParam } from "inversify-express-utils";
import { ISearchService } from "../../../domain/interfaces/services";
import { searchService } from "../../../domain/constants/decorators";

@controller("/api/search")
export class SearchController {
	@searchService public _searchService: ISearchService;

	@httpGet("/:query")
	public async get(@requestParam("query") query: string) {
		return this._searchService.search(query);
	}
}
