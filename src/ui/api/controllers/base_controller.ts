import { validate, ValidationError } from "class-validator";
import { BaseHttpController, interfaces } from "inversify-express-utils";

import { BaseCreateEntityDto } from "../../models/base_dto";

export abstract class BaseController extends BaseHttpController
    implements interfaces.Controller {
    protected async checkBadRequest(input: BaseCreateEntityDto) {
        const errors = await validate(input);
        if (errors.length > 0) {
            const error = errors
                .map((error: ValidationError) => error.constraints)
                .map(err => Object.values(err)[0])
                .join(", ");
            return this.badRequest(error);
        }
    }
}
