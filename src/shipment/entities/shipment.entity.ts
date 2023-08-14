import { AbstractEntity } from "src/common/entities/abstract.entity";
import { Column, Entity } from "typeorm";

@Entity({ name: 'shipment' })
export class ShipmentEntity extends AbstractEntity {
    @Column({ unique: true })
    shipment_number: string;
}