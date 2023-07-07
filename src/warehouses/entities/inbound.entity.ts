import { AbstractEntity } from "src/common/entities/abstract.entity";
import { ProductEntity } from "src/products/entities";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";

@Entity({ name: 'warehouse_inbound' })
export class InboundEntity extends AbstractEntity {
    @Column()
    shipment_number?: string;
    
    @Column()
    note?: string;

    @OneToMany(() => InboundDetailEntity, (inbound_detail) => inbound_detail.inbound)
    details: InboundDetailEntity[]
}

@Entity({ name: 'warehouse_inbound_detail' })
export class InboundDetailEntity extends AbstractEntity {
    @ManyToOne(() => ProductEntity, (product) => product.inbound_details)
    product: ProductEntity

    @Column()
    planned_inbound_quantity: number;

    @Column()
    actual_inbound_quantity: number;

    @Column()
    status: string;

    @ManyToOne(() => InboundEntity, (inbound) => inbound.details)
    inbound: InboundEntity
}