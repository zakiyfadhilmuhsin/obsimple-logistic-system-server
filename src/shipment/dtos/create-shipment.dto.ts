import { IsNotEmpty, IsString } from "class-validator";

export class CreateShipmentDto {
    @IsNotEmpty()
    @IsString()
    shipment_number: string;
}