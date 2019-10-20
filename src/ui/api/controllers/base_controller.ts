import { validate, ValidationError } from "class-validator";
import httpStatus from "http-status-codes";
import { Controller } from "tsoa";
import { isIdValid } from "../../../infrastructure/utils/server_utils";
import { HttpError } from "../../error";
import { BaseCreateEntityDto } from "../../models/base_dto";

export abstract class BaseController extends Controller {
    protected async checkBadRequest(input: BaseCreateEntityDto) {
        const errors = await validate(input);
        if (errors.length > 0) {
            const error = errors
                .map((error: ValidationError) => error.constraints)
                .map(err => Object.values(err)[0])
                .join(", ");
            this.setStatus(httpStatus.BAD_REQUEST);
            throw new HttpError(httpStatus.BAD_REQUEST, error);
        }
    }
    protected async checkConflict(input: any) {
        if (input) {
            this.setStatus(httpStatus.CONFLICT);
            throw new HttpError(httpStatus.CONFLICT);
        }
    }
    protected async checkUUID(id: any) {
        if (!isIdValid(id)) {
            this.setStatus(httpStatus.BAD_REQUEST);

            throw new HttpError(
                httpStatus.BAD_REQUEST,
                `ID "${id}" is invalid`
            );
        }
    }
}
