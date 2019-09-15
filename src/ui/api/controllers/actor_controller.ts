import { controller, httpGet, requestParam } from "inversify-express-utils";
import { actorRepository } from "../../../domain/constants/decorators";
import { IActorRepository } from "../../../domain/interfaces/repositories";

@controller("/api/actors")
export class ActorController {
	@actorRepository public _actorRepository: IActorRepository;

	@httpGet("/")
	public async get() {
		return await this._actorRepository.findAll();
	}

	@httpGet("/:id")
	public async getById(@requestParam("id") id: string) {
		return await this._actorRepository.findById(id);
	}
}
