import { ApiProperty } from "@nestjs/swagger";
import {
	IsBoolean,
	IsDate,
	IsInt,
	IsNotEmpty,
	IsString,
	Max,
	MaxLength,
	Min,
	MinDate,
	ValidationArguments,
	ValidatorConstraint,
	ValidatorConstraintInterface,
	IsMongoId
} from "class-validator";
import { schemaConst } from "../../shared/constants/entity.constant";
import { BaseCreateEntityDto } from "../../shared/dto/base.dto";
import { MAX_GRP_SIZE, MIN_GRP_SIZE } from "../group.entity";
import { DEFAULT_GRP_SIZE } from "./../group.entity";

@ValidatorConstraint()
class IsPublic implements ValidatorConstraintInterface {
	validate(isPublic: boolean, args: ValidationArguments) {
		// I want to use the request object here
		return true;
	}

	defaultMessage(args: ValidationArguments) {
		return "You don't have the right to create a public group";
	}
}

@ValidatorConstraint()
class CheckIsPublic implements ValidatorConstraintInterface {
	validate(text: string, args: ValidationArguments) {
		return false; // for async validations you must return a Promise<boolean> here
	}

	defaultMessage(args: ValidationArguments) {
		// here you can provide default error message if validation failed
		return "Text ($value) is too short or too long!";
	}
}
export class CreateGroupInput extends BaseCreateEntityDto {
	@ApiProperty({
		maxLength: schemaConst.MAX_NAME_LENGTH,
		description: "Non-space group name"
	})
	@MaxLength(schemaConst.MAX_NAME_LENGTH)
	@IsNotEmpty()
	title: string;

	@IsMongoId()
	@IsNotEmpty()
	@ApiProperty({
		maxLength: schemaConst.MAX_NAME_LENGTH,
		description: "Package ID"
	})
	package: string;

	@ApiProperty({
		minimum: MIN_GRP_SIZE,
		maximum: MAX_GRP_SIZE,
		default: DEFAULT_GRP_SIZE,
		example: DEFAULT_GRP_SIZE
	})
	@Max(MAX_GRP_SIZE)
	@Min(MIN_GRP_SIZE)
	@IsInt()
	@IsNotEmpty()
	size: number;

	@ApiProperty({
		maxLength: schemaConst.MAX_DESC_LENGTH
	})
	@MaxLength(schemaConst.MAX_DESC_LENGTH)
	@IsNotEmpty()
	@IsString()
	goal: string;

	@ApiProperty({
		example: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
		default: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
		type: String,
		format: "date-time"
	})
	@IsDate()
	@MinDate(new Date())
	expiresAt: Date;

	@ApiProperty({
		type: Boolean
	})
	//@Validate(IsPublic, { always: true,context:true})
	@IsBoolean()
	isPublic: boolean;
}
