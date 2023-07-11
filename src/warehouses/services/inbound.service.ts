import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { InboundDetailEntity, InboundEntity } from "../entities";
import { Repository } from "typeorm";
import { CreateInboundDetailDto, CreateInboundDto } from "../dtos";
import { ProductEntity } from "src/products/entities";
import { PageDto, PageMetaDto, PageOptionsDto } from "src/common/dtos";
import { InventoryService } from "src/inventories/services";
import { WarehouseService } from "./warehouse.service";
import { datatableGetItems } from "src/common/functions";

@Injectable()
export class InboundService {
    constructor(
        @InjectRepository(InboundEntity) private inboundRepository: Repository<InboundEntity>,
        @InjectRepository(InboundDetailEntity) private inboundDetailRepository: Repository<InboundDetailEntity>,
        @InjectRepository(ProductEntity) private productsRepository: Repository<ProductEntity>,
        private readonly inventoriesService: InventoryService,
        private readonly warehouseService: WarehouseService
    ) {}

    async createInbound(createInboundDto: CreateInboundDto) {
        const { details, ...inbound_data } = createInboundDto;
        const inbound_details: CreateInboundDetailDto[] = details;

        // Create New Inbound Head
        const newInbound = await this.inboundRepository.create(inbound_data);
        const createdInbound = await this.inboundRepository.save(newInbound);

        // Create New Inbound Detail
        const createdInboundDetail = await Promise.all(
            inbound_details.map(async (item: CreateInboundDetailDto) => {
                const newInboundDetail = await this.inboundDetailRepository.create({
                    product: await this.productsRepository.findOne({ where: { id: item.product } }),
                    planned_inbound_quantity: item.quantity,
                    actual_inbound_quantity: item.quantity,
                    status: '',
                    inbound: createdInbound
                });

                // Increase Stock
                const updateStock = await this.inventoriesService.updateStock({
                    product: item.product,
                    quantity: item.quantity,
                    type: 'increase'
                });

                // Create Stock Record
                await this.inventoriesService.createStockChangeRecord({
                    product: item.product,
                    movement_stock: item.quantity,
                    current_stock: updateStock.current_stock,
                    latest_stock: updateStock.latest_stock,
                    reason: 'Inbound'
                })

                // Create Stock In/Out Record
                await this.warehouseService.createStockInOut({
                    product: item.product,
                    adjustment_method: 'Inbound',
                    movement_stock: item.quantity,
                    current_stock: updateStock.current_stock,
                    latest_stock: updateStock.latest_stock,
                    remarks: 'Inbound'
                });

                if(inbound_data.inbound_type === 'RETURN') {
                    await this.warehouseService.createReturn({
                        product: item.product,
                        shipment_number: inbound_data.shipment_number,
                        quantity: item.quantity,
                        return_info: ''
                    })
                }

                return await this.inboundDetailRepository.save(newInboundDetail);
            })
        );

        return {
            ...createdInbound,
            details: createdInboundDetail
        };
    }

    async getInboundList(pageOptionsDto: PageOptionsDto) {
        // Relation
        const relations = [{ path: 'details' }];

        // Get Datatable Items
        return datatableGetItems(this.inboundRepository, "warehouse_inbound", pageOptionsDto, relations);
    }
}