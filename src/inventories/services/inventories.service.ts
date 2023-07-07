import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { StockEntity } from "../entities";
import { Repository } from "typeorm";
import { PageDto, PageMetaDto, PageOptionsDto } from "src/common/dtos";
import { StockRecordEntity } from "../entities/stock-record.entity";
import { CreateStockChangeRecordDto } from "../dtos/create-stock-change-record.dto";
import { UpdateStockDto } from "../dtos/update-stock.dto";
import { ProductEntity } from "src/products/entities";

@Injectable()
export class InventoryService {
    constructor(
        @InjectRepository(StockEntity) private stocksRepository: Repository<StockEntity>,
        @InjectRepository(StockRecordEntity) private stockRecordsRepository: Repository<StockRecordEntity>,
        @InjectRepository(ProductEntity) private productsRepository: Repository<ProductEntity>,
    ) {}

    async getStockList(pageOptionsDto: PageOptionsDto) {
        const queryBuilder = this.stocksRepository
            .createQueryBuilder("stocks")
            .innerJoinAndSelect("stocks.product", "product_name");
        
        queryBuilder
            .orderBy("stocks.createdAt", pageOptionsDto.order)
            .skip(pageOptionsDto.skip)
            .take(pageOptionsDto.take);

        const itemCount = await queryBuilder.getCount();
        const { entities } = await queryBuilder.getRawAndEntities();

        const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

        return new PageDto(entities, pageMetaDto);
    }

    async updateStock(updateStockDto: UpdateStockDto) {
        const { product, quantity, type } = updateStockDto;

        // Find Stock
        const stock = await this.stocksRepository.findOne({
            relations: ['product'],
            where: {
                product: {
                    id: product
                }
            }
        });

        // Save Latest Stock
        const latest_stock = stock.available_stock;

        // Update Available Stock
        if(type === 'increase') {
            stock.available_stock = Number(stock.available_stock) + Number(quantity);
        }else if(type === 'decrease') {
            stock.available_stock = Number(stock.available_stock) - Number(quantity);
        }
        
        // Save Stock
        const updatedStock = await this.stocksRepository.save(stock);

        // Return Data
        return {
            product: stock.product.id,
            sku: stock.product.sku,
            current_stock: updatedStock.available_stock,
            latest_stock: latest_stock,
        }
    }

    async createStockChangeRecord(createStockChangeRecordDto: CreateStockChangeRecordDto) {
        const { product, ...createStockChangeRecord } = createStockChangeRecordDto;
        const findProduct = await this.productsRepository.findOne({ where: { id: product } });
        const newData = {
            product: findProduct,
            ...createStockChangeRecord
        }

        const newStockChangeRecord = await this.stockRecordsRepository.create(newData);
        return await this.stockRecordsRepository.save(newStockChangeRecord);
    }

    async getStockRecordList(pageOptionsDto: PageOptionsDto) {
        const queryBuilder = this.stockRecordsRepository
            .createQueryBuilder("stock-records")
            .innerJoinAndSelect("stock-records.product", "product_name");
        
        queryBuilder
            //.orderBy("stock-records.createdAt", pageOptionsDto.order)
            .orderBy("stock-records.createdAt", 'DESC')
            .skip(pageOptionsDto.skip)
            .take(pageOptionsDto.take);

        const itemCount = await queryBuilder.getCount();
        const { entities } = await queryBuilder.getRawAndEntities();

        const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

        return new PageDto(entities, pageMetaDto);
    }
}