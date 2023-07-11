import { AbstractEntity } from "src/common/entities/abstract.entity";
import { ProductEntity } from "src/products/entities";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

@Entity({ name: 'warehouse_return' })
export class ReturnEntity extends AbstractEntity {
    @ManyToOne(() => ProductEntity, { cascade: true, eager: true })
    @JoinColumn()
    product: ProductEntity;

    @Column({ nullable: true })
    shipment_number?: string;

    @Column()
    quantity: number;

    @Column({ nullable: true })
    return_info?: string;
}