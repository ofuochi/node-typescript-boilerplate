import { Movie } from "../model/movie";

export interface ISearchService {
	search(query: string): Promise<Movie[]>;
}
