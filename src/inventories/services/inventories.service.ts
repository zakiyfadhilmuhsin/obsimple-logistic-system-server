import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { StockEntity } from "../entities";
import { Repository } from "typeorm";
import { PageOptionsDto } from "src/common/dtos";
import { StockRecordEntity } from "../entities/stock-record.entity";
import { CreateStockChangeRecordDto } from "../dtos/create-stock-change-record.dto";
import { UpdateStockDto } from "../dtos/update-stock.dto";
import { ProductEntity } from "src/products/entities";
import { datatableGetItems } from "src/common/functions";

@Injectable()
export class InventoryService {
    constructor(
        @InjectRepository(StockEntity) private stocksRepository: Repository<StockEntity>,
        @InjectRepository(StockRecordEntity) private stockRecordsRepository: Repository<StockRecordEntity>,
        @InjectRepository(ProductEntity) private productsRepository: Repository<ProductEntity>,
    ) {}

    async getStockList(pageOptionsDto: PageOptionsDto) {
        // Relation
        const relations = [{ path: 'product' }];

        // Get Datatable Items
        return datatableGetItems(this.stocksRepository, "stocks", pageOptionsDto, relations);
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
        // Relation
        const relations = [{ path: 'product' }];

        // Get Datatable Items
        return datatableGetItems(this.stockRecordsRepository, "stock-records", pageOptionsDto, relations);
    }

    async exportStockList() {
        const stockList = await this.stocksRepository.find({ relations: ['product'] }) as any;

        return stockList.map(item => ({
            sku: item.product.sku,
            product: item.product.product_name,
            available_stock: item.available_stock,
            created_at: item.createdAt,
            updated_at: item.updatedAt
        }))
    }

    async exportStockRecordList() {
        const stockRecordList = await this.stockRecordsRepository.find({ relations: ['product'] }) as any;

        return stockRecordList.map(item => ({
            sku: item.product.sku,
            product: item.product.product_name,
            current_stock: item.current_stock,
            latest_stock: item.latest_stock,
            movement_stock: item.movement_stock,
            created_at: item.createdAt,
            updated_at: item.updatedAt
        }))
    }
}