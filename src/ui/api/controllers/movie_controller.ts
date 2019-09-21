import {
    controller,
    httpGet,
    httpPost,
    requestBody,
    requestParam
} from "inversify-express-utils";

import { movieRepository } from "../../../domain/constants/decorators";
import { IMovieRepository } from "../../../domain/interfaces/repositories";
import { Movie } from "../../../domain/model/movie";

@controller("/movies")
export class MovieController {
    @movieRepository private readonly _movieRepository: IMovieRepository;

    @httpGet("/")
    public async get(): Promise<Movie[]> {
        return await this._movieRepository.findAll();
    }
    @httpGet("/:id")
    public async getById(@requestParam("id") id: string) {
        return await this._movieRepository.findById(id);
    }
    @httpPost("/")
    public async post(@requestBody() movieDto: Movie) {
        return await this._movieRepository.save(movieDto);
    }
}
