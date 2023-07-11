import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateReturnDto {
    @IsNumber()
    @IsNotEmpty()
    product: number;

    @IsString()
    @IsNotEmpty()
    shipment_number: string;

    @IsNumber()
    @IsNotEmpty()
    quantity: number;

    @IsString()
    @IsOptional()
    return_info?: string;
}