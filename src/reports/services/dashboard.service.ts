import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductEntity } from "src/products/entities";
import { InboundEntity, OutboundEntity, StockInOutEntity } from "src/warehouses/entities";
import { ReturnEntity } from "src/warehouses/entities/return.entity";
import { Repository } from "typeorm";

@Injectable()
export class DashboardService {
    constructor(
        @InjectRepository(ProductEntity) private productRepository: Repository<ProductEntity>,
        @InjectRepository(InboundEntity) private inboundRepository: Repository<InboundEntity>,
        @InjectRepository(OutboundEntity) private outboundRepository: Repository<OutboundEntity>,
        @InjectRepository(ReturnEntity) private returnRepository: Repository<ReturnEntity>,
        @InjectRepository(StockInOutEntity) private stockInOutRepository: Repository<StockInOutEntity>
    ) {}

    async dashboardStatistics() {
        const inbound = await this.inboundRepository.count({});
        const outbound = await this.outboundRepository.count({});
        const prepared_outbound = await this.outboundRepository.count({ where: { status: 'prepared' } } as any);
        const pickup_outbound = await this.outboundRepository.count({ where: { status: 'pickup' } } as any);
        const sku_items = await this.productRepository.count();
        const returnQueryBuilder = await this.returnRepository.createQueryBuilder('warehouse_return')
            .select('SUM(warehouse_return.quantity)', 'total_return_items')
            .getRawOne();
        const stockInQueryBuilder = await this.stockInOutRepository.createQueryBuilder('warehouse_stock_in_out')
            .where('warehouse_stock_in_out.adjustment_method = :type', { type: 'Inbound' })
            .select('SUM(warehouse_stock_in_out.movement_stock)', 'total_stock_in')
            .getRawOne();
        const stockOutQueryBuilder = await this.stockInOutRepository.createQueryBuilder('warehouse_stock_in_out')
            .where('warehouse_stock_in_out.adjustment_method = :type', { type: 'Outbound' })
            .select('SUM(warehouse_stock_in_out.movement_stock)', 'total_stock_out')
            .getRawOne();

        return {
            inbound,
            outbound,
            prepared_outbound,
            pickup_outbound,
            sku_items,
            return_items: Number(returnQueryBuilder.total_return_items),
            stock_in: Number(stockInQueryBuilder.total_stock_in),
            stock_out: Number(stockOutQueryBuilder.total_stock_out)
        }
    }

    async dashboardTopProducts() {
        const products = await this.productRepository.find({ relations: ['stock_in_out_records'] });
        const top_products = products.map(item => ({
            product_name: item.product_name,
            total_sales: item.stock_in_out_records.reduce((total, sales) => { 
                return Number(total) + Number(sales.adjustment_method === 'Outbound' ? sales.movement_stock : 0)
            }, 0)
        }));

        return top_products.sort((a, b) => b.total_sales - a.total_sales);
    }

    async dashboardSalesTimeSeries() {
        const stockOut = await this.stockInOutRepository.createQueryBuilder('warehouse_stock_in_out')
            .where('warehouse_stock_in_out.adjustment_method = :type', { type: 'Outbound' })
            .select("DATE_TRUNC('day', warehouse_stock_in_out.createdAt)", 'date')
            .addSelect('SUM(warehouse_stock_in_out.movement_stock)', 'total_sales')
            .groupBy('date')
            .orderBy('date', 'ASC')
            .getRawMany();

        return stockOut;
    }
}