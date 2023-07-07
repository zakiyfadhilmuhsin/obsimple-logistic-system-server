import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateStockDto {
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    available_stock: number;
}