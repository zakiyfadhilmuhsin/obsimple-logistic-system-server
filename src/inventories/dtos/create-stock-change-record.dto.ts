import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString, isNotEmpty } from "class-validator";

export class CreateStockChangeRecordDto {
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    product: number;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    movement_stock: number;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    current_stock: number;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    latest_stock: number;

    @IsString()
    @IsOptional()
    @ApiProperty()
    reason: string;
}