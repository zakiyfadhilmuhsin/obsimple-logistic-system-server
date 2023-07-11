import { AbstractEntity } from "src/common/entities/abstract.entity";
import { StockEntity, StockRecordEntity } from "src/inventories/entities";
import { InboundDetailEntity, OutboundDetailEntity, StockInOutEntity } from "src/warehouses/entities";
import { ReturnEntity } from "src/warehouses/entities/return.entity";
import { Column, Entity, OneToMany, OneToOne } from "typeorm";

@Entity({ name: 'products' })
export class ProductEntity extends AbstractEntity {
    @Column()
    sku: string;

    @Column()
    product_name: string;

    @Column()
    description: string;

    @Column()
    barcode: string;

    @OneToMany(() => InboundDetailEntity, (inbound_detail) => inbound_detail.product)
    inbound_details: InboundDetailEntity[]

    @OneToMany(() => OutboundDetailEntity, (outbound_detail) => outbound_detail.product)
    outbound_details: OutboundDetailEntity[];

    @OneToOne(() => StockEntity, (stocks) => stocks.product)
    stocks: StockEntity;

    @OneToMany(() => StockRecordEntity, (stock_record) => stock_record.product)
    stock_records: StockRecordEntity[];

    @OneToMany(() => StockInOutEntity, (stock_in_out) => stock_in_out.product)
    stock_in_out_records: StockInOutEntity[];

    @OneToMany(() => ReturnEntity, (warehouse_return) => warehouse_return.product)
    warehouse_return: ReturnEntity;
}
