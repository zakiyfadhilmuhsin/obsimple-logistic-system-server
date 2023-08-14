import { Module } from "@nestjs/common";
import { ShipmentController } from "./controllers";
import { ShipmentService } from "./services";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ShipmentEntity } from "./entities";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            ShipmentEntity
        ]),
    ],
    controllers: [
        ShipmentController
    ],
    providers: [
        ShipmentService
    ]
})
export class ShipmentModule {}