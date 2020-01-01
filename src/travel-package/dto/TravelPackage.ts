import { ApiProperty } from "@nestjs/swagger";

export class PackagesResponse {
	@ApiProperty()
	id: string;
	@ApiProperty()
	title: string;
	@ApiProperty()
	shortDescription: string;
	@ApiProperty()
	discount: number;
	@ApiProperty()
	price: number;
	@ApiProperty()
	img: string[];
}

export class PackageResponse extends PackagesResponse {
	@ApiProperty()
	packageInstructions: string[];
	@ApiProperty()
	packageExclusions: string[];
}
