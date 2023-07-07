import { AbstractEntity } from "src/common/entities/abstract.entity";
import { ProductEntity } from "src/products/entities";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

@Entity({ name: 'stock-records' })
export class StockRecordEntity extends AbstractEntity {
    @ManyToOne(() => ProductEntity, { cascade: true, eager: true })
    @JoinColumn()
    product: ProductEntity;

    @Column()
    movement_stock: number;

    @Column()
    current_stock: number;

    @Column()
    latest_stock: number;

    @Column()
    reason?: string;
}