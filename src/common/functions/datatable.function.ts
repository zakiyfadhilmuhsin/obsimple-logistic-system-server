import { PageDto, PageMetaDto, PageOptionsDto } from "../dtos";

type Relation = {
    path: string;
    relation?: Relation
}

export async function datatableGetItems(
    repository: any,
    model: string,
    pageOptionsDto: PageOptionsDto,
    relations?: Relation[]
) {
    // Get Model
    const queryBuilder = repository.createQueryBuilder(model);

    // Relations
    function handleRelation(relations) {
        relations.forEach(item => {
            if(item.relation) {
                queryBuilder.leftJoinAndSelect(`${model}.${item.path}`, 'uuid');
                handleRelation(item.relation);
            }else{
                queryBuilder.leftJoinAndSelect(`${model}.${item.path}`, 'uuid');
            }
        });
    }
    if(relations && relations.length > 0) {
        handleRelation(relations);
    }

    // Search
    if(pageOptionsDto.search_by && pageOptionsDto.search_value) {
        queryBuilder.where(`LOWER(${model}.${pageOptionsDto.search_by}) ILIKE LOWER(:keyword)`, { keyword: `%${pageOptionsDto.search_value}%` });
    }

    // Filter Date
    if(pageOptionsDto.start_date && pageOptionsDto.end_date) {
        const startDate = pageOptionsDto.start_date;
        const endDate = pageOptionsDto.end_date;
        queryBuilder.andWhere(`${model}.createdAt BETWEEN :startDate AND :endDate`, { startDate, endDate });
    }

    // Filter Field
    if(pageOptionsDto.filters) {
        pageOptionsDto.filters.forEach((item => {
            queryBuilder.andWhere(`${model}.${item} = :${item}`, { [item]: item });
        }))
    }

    // Sort
    if(pageOptionsDto.sort_order && pageOptionsDto.sort_by) {
        queryBuilder.orderBy(model[pageOptionsDto.sort_by], pageOptionsDto.sort_order);
    }

    // Pagination
    queryBuilder
        .skip(pageOptionsDto.skip)
        .take(pageOptionsDto.limit);

    // Calculate
    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    // Prepare Data Result
    const pageMetaDto = new PageMetaDto({ pageOptionsDto, itemCount });

    // Return Result
    return new PageDto(entities, pageMetaDto);
}