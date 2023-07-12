import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductEntity } from "src/products/entities";
import { InboundEntity, OutboundEntity, StockInOutEntity } from "src/warehouses/entities";
import { ReturnEntity } from "src/warehouses/entities/return.entity";
import { DashboardService } from "./services";
import { DashboardController } from "./controllers";

@Module({
    imports: [TypeOrmModule.forFeature([
        ProductEntity,
        StockInOutEntity,
        InboundEntity,
        OutboundEntity,
        ReturnEntity
    ])],
    providers: [DashboardService],
    controllers: [DashboardController]
})
export class ReportsModule {}