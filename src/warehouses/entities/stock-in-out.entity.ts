import { AbstractEntity } from "src/common/entities/abstract.entity";
import { ProductEntity } from "src/products/entities";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

@Entity({ name: 'warehouse_stock_in_out' })
export class StockInOutEntity extends AbstractEntity {
    @ManyToOne(() => ProductEntity, { cascade: true, eager: true })
    @JoinColumn()
    product: ProductEntity;

    @Column()
    adjustment_method: string;

    @Column()
    movement_stock: number;

    @Column()
    current_stock: number;

    @Column()
    latest_stock: number;

    @Column()
    remarks?: string;
}