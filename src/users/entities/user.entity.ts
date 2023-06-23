import { AbstractEntity } from "src/common/entities/abstract.entity";
import { Column, Entity } from "typeorm";

@Entity({ name: 'users' })
export class UserEntity extends AbstractEntity {
    @Column({ unique: true })
    public email: string;

    @Column()
    public name: string;

    @Column()
    public password: string;
}