import { AbstractEntity } from "src/common/entities/abstract.entity";
import { ProductEntity } from "src/products/entities";
import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

@Entity({ name: 'stocks' })
export class StockEntity extends AbstractEntity {
    @Column()
    available_stock: number;

    @OneToOne(() => ProductEntity, (product) => product.stocks)
    @JoinColumn()
    product: ProductEntity;
}