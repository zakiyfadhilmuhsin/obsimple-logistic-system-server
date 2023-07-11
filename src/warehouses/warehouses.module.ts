import { Module } from "@nestjs/common";
import { InboundService } from "./services/inbound.service";
import { OutboundService } from "./services/outbound.service";
import { InboundController } from "./controllers/inbound.controller";
import { OutboundController } from "./controllers/outbound.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { InboundDetailEntity, InboundEntity, OutboundDetailEntity, OutboundEntity, StockInOutEntity } from "./entities";
import { ProductEntity } from "src/products/entities";
import { InventoriesModule } from "src/inventories/inventories.module";
import { WarehouseService } from "./services/warehouse.service";
import { WarehouseController } from "./controllers/warehouse.controller";
import { ReturnEntity } from "./entities/return.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            InboundEntity, 
            InboundDetailEntity,
            OutboundEntity,
            OutboundDetailEntity,
            StockInOutEntity,
            ProductEntity,
            ReturnEntity
        ]),
        InventoriesModule
    ],
    providers: [
        InboundService,
        OutboundService,
        WarehouseService
    ],
    controllers: [
        InboundController,
        OutboundController,
        WarehouseController
    ]
})
export class WarehousesModule {}