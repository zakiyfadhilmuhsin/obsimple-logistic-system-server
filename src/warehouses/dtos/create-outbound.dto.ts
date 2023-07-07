import { Type } from "class-transformer";
import { ArrayMinSize, ArrayNotEmpty, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";

export class CreateOutboundDto {
    @IsNotEmpty()
    @IsString()
    shipment_number: string;

    @IsOptional()
    @IsString()
    note: string;

    @ArrayNotEmpty()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => CreateOutboundDetailDto)
    details: CreateOutboundDetailDto[]
}

export class CreateOutboundDetailDto {
    @IsNotEmpty()
    @IsNumber()
    product: number;

    @IsNotEmpty()
    @IsNumber()
    quantity: number;
}