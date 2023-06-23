import { AbstractEntity } from "src/common/entities/abstract.entity";
import { Column, Entity } from "typeorm";

@Entity({ name: 'posts' })
export class PostEntity extends AbstractEntity {
    @Column()
    public title: string;

    @Column()
    public content: string;
}
