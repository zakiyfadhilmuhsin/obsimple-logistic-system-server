import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { StockInOutEntity } from "../entities";
import { Repository } from "typeorm";
import { CreateStockInOutDto } from "../dtos/create-stock-in-out.dto";
import { ProductEntity } from "src/products/entities";
import { PageDto, PageMetaDto, PageOptionsDto } from "src/common/dtos";
import { datatableGetItems } from "src/common/functions";
import { CreateReturnDto } from "../dtos/create-return.dto";
import { ReturnEntity } from "../entities/return.entity";

@Injectable()
export class WarehouseService {
    constructor(
        @InjectRepository(StockInOutEntity) private stockInOutRepository: Repository<StockInOutEntity>,
        @InjectRepository(ProductEntity) private productsRepository: Repository<ProductEntity>,
        @InjectRepository(ReturnEntity) private returnRepository: Repository<ReturnEntity>
    ) {}

    async createStockInOut(createStockInOutDto: CreateStockInOutDto) {
        const { product, ...createStockInOut } = createStockInOutDto;
        const findProduct = await this.productsRepository.findOne({ where: { id: product } });
        const newData = {
            product: findProduct,
            ...createStockInOut
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

    async createReturn(createReturnDto: CreateReturnDto) {
        const { product, ...createReturn } = createReturnDto;
        const findProduct = await this.productsRepository.findOne({ where: { id: product } });
        const newData = {
            product: findProduct,
            ...createReturn
        }

        const newReturn = await this.returnRepository.create(newData);
        return await this.returnRepository.save(newReturn);
    }

    async getReturn(pageOptionsDto: PageOptionsDto) {
        // Relation
        const relations = [{ path: 'product' }];

        // Get Datatable Items
        return datatableGetItems(this.returnRepository, "warehouse_return", pageOptionsDto, relations);
    }

    async exportStockInOutList() {
        const stockInOutList = await this.stockInOutRepository.find({ relations: ['product'] }) as any;

        return stockInOutList.map(item => ({
            sku: item.product.sku,
            product: item.product.product_name,
            adjustment_method: item.adjustment_method,
            movement_stock: item.movement_stock,
            current_stock: item.current_stock,
            latest_stock: item.latest_stock,
            remarks: item.remarks,
            created_at: item.createdAt,
            updated_at: item.updatedAt
        }));
    }

    async exportReturnList() {
        const returnList = await this.returnRepository.find({ relations: ['product'] }) as any;

        return returnList.map(item => ({
            sku: item.product.sku,
            product: item.product.product_name,
            shipment_number: item.shipment_number,
            quantity: item.quantity,
            return_info: item.return_info,
            created_at: item.createdAt,
            updated_at: item.updatedAt
        }))
    }
}