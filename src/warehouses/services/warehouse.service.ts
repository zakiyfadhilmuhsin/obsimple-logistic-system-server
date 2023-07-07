import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { StockInOutEntity } from "../entities";
import { Repository } from "typeorm";
import { CreateStockInOutDto } from "../dtos/create-stock-in-out.dto";
import { ProductEntity } from "src/products/entities";
import { PageDto, PageMetaDto, PageOptionsDto } from "src/common/dtos";

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
        const queryBuilder = this.stockInOutRepository
            .createQueryBuilder("warehouse_stock_in_out")
            .innerJoinAndSelect("warehouse_stock_in_out.product", "product_name");
        
        queryBuilder
            //.orderBy("warehouse_stock_in_out.createdAt", pageOptionsDto.order)
            .orderBy("warehouse_stock_in_out.createdAt", 'DESC')
            .skip(pageOptionsDto.skip)
            .take(pageOptionsDto.take);

        const itemCount = await queryBuilder.getCount();
        const { entities } = await queryBuilder.getRawAndEntities();

        const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

        return new PageDto(entities, pageMetaDto);
    }
}