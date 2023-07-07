import { AbstractEntity } from "src/common/entities/abstract.entity";
import { StockRecordEntity } from "src/inventories/entities";
import { InboundDetailEntity, OutboundDetailEntity, StockInOutEntity } from "src/warehouses/entities";
import { Column, Entity, OneToMany } from "typeorm";

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
    outbound_details: OutboundDetailEntity[]

    @OneToMany(() => StockRecordEntity, (stock_record) => stock_record.product)
    stock_records: StockRecordEntity[]

    @OneToMany(() => StockInOutEntity, (stock_in_out) => stock_in_out.product)
    stock_in_out_records: StockInOutEntity[]
}
