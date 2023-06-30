import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { PageDto, PageMetaDto, PageOptionsDto } from "../dtos";

@Injectable()
export class PageDataService<T> {
    constructor(private readonly _repository: Repository<T>) {}

    public async getItems(
        model: string,
        pageOptionsDto: PageOptionsDto
    ): Promise<PageDto<T>> {
        const queryBuilder = this._repository.createQueryBuilder(model);

        queryBuilder
            .orderBy(model['createdAt'], pageOptionsDto.order)
            .skip(pageOptionsDto.skip)
            .take(pageOptionsDto.take)

        const itemCount = await queryBuilder.getCount();
        const { entities } = await queryBuilder.getRawAndEntities();

        const pageMetaDto = new PageMetaDto({ pageOptionsDto, itemCount });

        return new PageDto(entities, pageMetaDto);
    }
}