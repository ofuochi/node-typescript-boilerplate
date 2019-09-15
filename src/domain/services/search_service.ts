import { injectable } from "inversify";
import { ISearchService } from "../interfaces/services";
import { Movie } from "../model/movie";
import { Actor } from "../model/actor";
import { Director } from "../model/director";
import {
	movieRepository,
	actorRepository,
	directorRepository
} from "../constants/decorators";
import {
	IMovieRepository,
	IDirectorRepository,
	IActorRepository
} from "../interfaces/repositories";

@injectable()
export class SearchService implements ISearchService {
	@movieRepository private _movieRepository: IMovieRepository;
	@actorRepository private _actorRepository: IActorRepository;
	@directorRepository private _directorRepository: IDirectorRepository;

	public async search(query: string): Promise<Movie[]> {
		const moviesWithMatchingTitle = await this._movieRepository.findManyByQuery(
			{
				title: {
					$regex: new RegExp(query, "ig")
				}
			}
		);

		const matchingActors = await this._actorRepository.findManyByQuery({
			name: {
				$regex: new RegExp(query, "ig")
			}
		});

		const matchingDirectors = await this._directorRepository.findManyByQuery({
			name: {
				$regex: new RegExp(query, "ig")
			}
		});

		const getMovieIds = (arr: Actor[] | Director[]) => {
			return arr.map(i => i.movies).reduce((p, c) => [...p, ...c], []);
		};

		const moviesIdsWithMatchingDirector = getMovieIds(matchingDirectors);

		const movieIdsWithMatchingActor = getMovieIds(matchingActors);

		const movieIdsWithMatchingActorOrDirector = [
			...moviesIdsWithMatchingDirector,
			...movieIdsWithMatchingActor
		];

		const moviesWithMatchingActorOrDirector = await this._movieRepository.findManyById(
			movieIdsWithMatchingActorOrDirector
		);

		const matchingMovies = [
			...moviesWithMatchingTitle,
			...moviesWithMatchingActorOrDirector
		];

		return matchingMovies;
	}
}
