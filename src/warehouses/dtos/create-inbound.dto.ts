import { Type } from "class-transformer";
import { ArrayMinSize, ArrayNotEmpty, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { InboundType } from "src/common/constants";

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
    
    @IsOptional()
    @IsEnum(InboundType)
    inbound_type: InboundType;
}

export class CreateInboundDetailDto {
    @IsNotEmpty()
    @IsNumber()
    product: number;

    @IsNotEmpty()
    @IsNumber()
    quantity: number;

    @IsOptional()
    @IsString()
    expired_time: string;
}