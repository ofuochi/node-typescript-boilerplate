import { validate, ValidationError } from "class-validator";
import { BaseHttpController } from "inversify-express-utils";

import { BaseCreateDto } from "../../models/base_dto";

export abstract class BaseController extends BaseHttpController {
    protected async checkBadRequest(input: BaseCreateDto) {
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
