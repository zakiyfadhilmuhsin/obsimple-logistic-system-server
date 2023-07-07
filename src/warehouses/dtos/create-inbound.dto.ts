import { Type } from "class-transformer";
import { ArrayMinSize, ArrayNotEmpty, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";

export class CreateInboundDto {
    @IsOptional()
    @IsString()
    shipment_number: string;

    @IsOptional()
    @IsString()
    note: string;

    @ArrayNotEmpty()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => CreateInboundDetailDto)
    details: CreateInboundDetailDto[]
}

export class CreateInboundDetailDto {
    @IsNotEmpty()
    @IsNumber()
    product: number;

    @IsNotEmpty()
    @IsNumber()
    quantity: number;
}