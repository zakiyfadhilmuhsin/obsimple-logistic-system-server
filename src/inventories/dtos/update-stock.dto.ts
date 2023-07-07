import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class UpdateStockDto {
    @IsNotEmpty()
    @IsNumber()
    product: number;

    @IsNotEmpty()
    @IsNumber()
    quantity: number;

    @IsNotEmpty()
    @IsString()
    type: string;
}