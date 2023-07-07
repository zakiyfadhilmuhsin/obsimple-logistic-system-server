import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { OutboundDetailEntity, OutboundEntity } from "../entities";
import { Repository } from "typeorm";
import { ProductEntity } from "src/products/entities";
import { CreateOutboundDetailDto, CreateOutboundDto } from "../dtos";
import { PageDto, PageMetaDto, PageOptionsDto } from "src/common/dtos";
import { InventoryService } from "src/inventories/services";
import { WarehouseService } from "./warehouse.service";
import { OutboundStatus } from "src/common/constants";

@Injectable()
export class OutboundService {
    constructor(
        @InjectRepository(OutboundEntity) private outboundRepository: Repository<OutboundEntity>,
        @InjectRepository(OutboundDetailEntity) private outboundDetailRepository: Repository<OutboundDetailEntity>,
        @InjectRepository(ProductEntity) private productsRepository: Repository<ProductEntity>,
        private readonly inventoriesService: InventoryService,
        private readonly warehouseService: WarehouseService
    ) {}

    async createOutbound(createOutboundDto: CreateOutboundDto) {
        const { details, ...outbound_data } = createOutboundDto;
        const outbound_details: CreateOutboundDetailDto[] = details;

        // Create New Outbound Head
        const newOutbound = await this.outboundRepository.create(outbound_data);
        const createdOutbound = await this.outboundRepository.save(newOutbound);

        // Create New Outbound Detail
        const createdOutboundDetail = await Promise.all(
            outbound_details.map(async (item: CreateOutboundDetailDto) => {
                const newOutboundDetail = await this.outboundDetailRepository.create({
                    product: await this.productsRepository.findOne({ where: { id: item.product } }),
                    planned_outbound_quantity: item.quantity,
                    actual_outbound_quantity: item.quantity,
                    outbound: createdOutbound
                });

                // Decrease Stock
                const updateStock = await this.inventoriesService.updateStock({
                    product: item.product,
                    quantity: item.quantity,
                    type: 'decrease'
                });

                // Create Stock Record
                await this.inventoriesService.createStockChangeRecord({
                    product: item.product,
                    movement_stock: item.quantity,
                    current_stock: updateStock.current_stock,
                    latest_stock: updateStock.latest_stock,
                    reason: 'Outbound Sales'
                })

                // Create Stock In/Out Record
                await this.warehouseService.createStockInOut({
                    product: item.product,
                    adjustment_method: 'Outbound',
                    movement_stock: item.quantity,
                    current_stock: updateStock.current_stock,
                    latest_stock: updateStock.latest_stock,
                    remarks: 'Outbound Sales'
                });

                return await this.outboundDetailRepository.save(newOutboundDetail);
            })
        );

        return {
            ...createdOutbound,
            details: createdOutboundDetail
        };
    }

    async getOutboundList(pageOptionsDto: PageOptionsDto) {
        const queryBuilder = this.outboundRepository
            .createQueryBuilder("warehouse_outbound")
            .innerJoinAndSelect("warehouse_outbound.details", "uuid");
        
        queryBuilder
            .orderBy("warehouse_outbound.createdAt", pageOptionsDto.order)
            .skip(pageOptionsDto.skip)
            .take(pageOptionsDto.take);

        const itemCount = await queryBuilder.getCount();
        const { entities } = await queryBuilder.getRawAndEntities();

        const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

        return new PageDto(entities, pageMetaDto);
    }

    async getOutboundById(id: number) {
        return await this.outboundRepository.findOne({ 
            where: { id: id }, 
            relations: {
                details: {
                    product: true
                }
            } 
        });
    }

    async processPickup(data: any) {
        const getOutbound = await this.outboundRepository.findOne({ where: { id: data.id } });
        getOutbound.status = data.status;
        const updateOutbound = await this.outboundRepository.save(getOutbound);

        const updateOutboundDetails = await Promise.all([
            data.details.map(async (item) => {
                const getOutboundDetail = await this.outboundDetailRepository.findOne({ where: { id: item.key } });
                getOutboundDetail.status = item.status;
                return await this.outboundDetailRepository.save(getOutboundDetail);
            })
        ]);

        return {
            updateOutbound,
            details: updateOutboundDetails
        }
    }
}