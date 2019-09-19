import {
    controller,
    httpGet,
    requestParam,
    httpPost,
    requestBody
} from "inversify-express-utils";
import { IMovieRepository } from "../../../domain/interfaces/repositories";
import {
    movieRepository,
    eventDispatcher
} from "../../../domain/constants/decorators";
import { Movie } from "../../../domain/model/movie";

import { IEventDispatcher } from "../../../infrastructure/bootstrapping/eventDispatcher";

@controller("/api/movies")
export class MovieController {
    @movieRepository private readonly _movieRepository: IMovieRepository;
    @eventDispatcher private readonly _event: IEventDispatcher;
    @httpGet("/")
    public async get(): Promise<Movie[]> {
        this._event.dispatch("Hello", { hi: "kd" });
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
