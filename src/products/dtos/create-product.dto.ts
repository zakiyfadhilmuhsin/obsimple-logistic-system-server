import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateProductDto {
    @IsNotEmpty()
    @IsString()
    sku: string;

    @IsNotEmpty()
    @IsString()
    product_name: string;

    @IsOptional()
    @IsString()
    description: string;

    @IsOptional()
    @IsString()
    barcode: string;

    @IsNotEmpty()
    @IsNumber()
    stock: number;
}
