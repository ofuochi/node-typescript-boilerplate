import {
    controller,
    httpGet,
    requestParam,
    httpPost,
    requestBody
} from "inversify-express-utils";
import { IMovieRepository } from "../../../domain/interfaces/repositories";
import { movieRepository } from "../../../domain/constants/decorators";
import { Movie } from "../../../domain/model/movie";

@controller("/api/movies")
export class MovieController {
    @movieRepository private _movieRepository: IMovieRepository;
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
