import { OutboundStatus } from "src/common/constants";
import { AbstractEntity } from "src/common/entities/abstract.entity";
import { ProductEntity } from "src/products/entities";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";

@Entity({ name: 'warehouse_outbound' })
export class OutboundEntity extends AbstractEntity {
    @Column()
    shipment_number: string;
    
    @Column()
    note?: string;

    @Column({
        type: 'enum',
        enum: OutboundStatus,
        default: OutboundStatus.PREPARED
    })
    status: OutboundStatus

    @OneToMany(() => OutboundDetailEntity, (outbound_detail) => outbound_detail.outbound)
    details: OutboundDetailEntity[]
}

@Entity({ name: 'warehouse_outbound_detail' })
export class OutboundDetailEntity extends AbstractEntity {
    @ManyToOne(() => ProductEntity, (product) => product.inbound_details)
    @JoinColumn()
    product: ProductEntity

    @Column()
    planned_outbound_quantity: number;

    @Column()
    actual_outbound_quantity: number;

    @Column({
        type: 'enum',
        enum: OutboundStatus,
        default: OutboundStatus.PREPARED
    })
    status: OutboundStatus;

    @ManyToOne(() => OutboundEntity, (outbound) => outbound.details)
    outbound: OutboundEntity
}