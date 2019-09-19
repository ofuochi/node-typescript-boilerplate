import { controller, httpGet, requestParam } from "inversify-express-utils";
import { IDirectorRepository } from "../../../domain/interfaces/repositories";
import { directorRepository } from "../../../domain/constants/decorators";

@controller("/api/directors")
export class DirectorController {
    @directorRepository public _directorRepository: IDirectorRepository;

    @httpGet("/")
    public async get() {
        return await this._directorRepository.findAll();
    }

    @httpGet("/:id")
    public async getById(@requestParam("id") id: string) {
        return await this._directorRepository.findById(id);
    }
}
