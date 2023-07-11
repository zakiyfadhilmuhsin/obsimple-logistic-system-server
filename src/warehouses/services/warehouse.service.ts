import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { StockInOutEntity } from "../entities";
import { Repository } from "typeorm";
import { CreateStockInOutDto } from "../dtos/create-stock-in-out.dto";
import { ProductEntity } from "src/products/entities";
import { PageDto, PageMetaDto, PageOptionsDto } from "src/common/dtos";
import { datatableGetItems } from "src/common/functions";

@Injectable()
export class WarehouseService {
    constructor(
        @InjectRepository(StockInOutEntity) private stockInOutRepository: Repository<StockInOutEntity>,
        @InjectRepository(ProductEntity) private productsRepository: Repository<ProductEntity>,
    ) {}

    async createStockInOut(createStockInOutDto: CreateStockInOutDto) {
        const { product, ...createstockInOut } = createStockInOutDto;
        const findProduct = await this.productsRepository.findOne({ where: { id: product } });
        const newData = {
            product: findProduct,
            ...createstockInOut
        }

        const newStockInOut = await this.stockInOutRepository.create(newData);
        return await this.stockInOutRepository.save(newStockInOut);
    }

    async getStockInOutRecord(pageOptionsDto: PageOptionsDto) {
        // Relation
        const relations = [{ path: 'product' }];

        // Get Datatable Items
        return datatableGetItems(this.stockInOutRepository, "warehouse_stock_in_out", pageOptionsDto, relations);
    }
}