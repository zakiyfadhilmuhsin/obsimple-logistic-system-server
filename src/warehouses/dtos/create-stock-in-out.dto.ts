import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateStockInOutDto {
    @IsNumber()
    @IsNotEmpty()
    product: number;

    @IsNotEmpty()
    @IsString()
    adjustment_method: string;

    @IsNotEmpty()
    @IsNumber()
    movement_stock: number;

    @IsNotEmpty()
    @IsNumber()
    current_stock: number;

    @IsNotEmpty()
    @IsNumber()
    latest_stock: number;

    @IsOptional()
    @IsString()
    remarks: string;
}