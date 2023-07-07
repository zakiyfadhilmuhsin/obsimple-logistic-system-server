import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { StockEntity, StockRecordEntity } from "./entities";
import { InventoryService } from "./services";
import { InventoryController } from "./controllers";
import { ProductEntity } from "src/products/entities";

@Module({
    imports: [
        TypeOrmModule.forFeature([StockEntity, StockRecordEntity, ProductEntity]),
    ],
    exports: [InventoryService],
    controllers: [InventoryController],
    providers: [InventoryService]
})
export class InventoriesModule {}