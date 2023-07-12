import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsDate, IsEnum, IsInt, IsOptional, IsString, Max, Min } from "class-validator";
import { Type } from "class-transformer";
import { Order } from "../constants";

/**
 * Table of Components
 * 
 * A. Pagination
 *      A.1 Page [DONE]
 *      A.2 Limit [DONE]
 * B. Sorting
 *      B.1 Sort By [DONE]
 *      B.2 Order By [DONE]
 * C. Search
 *      C.1 Search By [DONE]
 *      C.2 Search Value [DONE]
 * D. Filter Date
 *      D.1 Start Date [DONE]
 *      D.2 End Date [DONE]
 * E. Filtering
 *      E.1 Filter By [DONE]
 *      E.2 Filter Value [DONE]
 */

export class PageOptionsDto {
    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    readonly sort_by?: string;

    @ApiPropertyOptional({ enum: Order, default: Order.ASC })
    @IsEnum(Order)
    @IsOptional()
    readonly sort_order?: Order = Order.ASC;

    @ApiPropertyOptional({
        minimum: 1,
        default: 1
    })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @IsOptional()
    readonly page?: number = 1;

    @ApiPropertyOptional({
        minimum: 1,
        maximum: 50,
        default: 10,
    })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(50)
    @IsOptional()
    readonly limit?: number = 10;

    @ApiPropertyOptional()
    @Type(() => String)
    @IsString()
    @IsOptional()
    readonly search_by?: string = 'id';

    @ApiPropertyOptional()
    @Type(() => String)
    @IsString()
    @IsOptional()
    readonly search_value?: string = '';

    @ApiPropertyOptional()
    @Type(() => Date)
    @IsDate()
    @IsOptional()
    readonly start_date?: Date;

    @ApiPropertyOptional()
    @Type(() => Date)
    @IsDate()
    @IsOptional()
    readonly end_date?: Date;

    @ApiPropertyOptional()
    @IsOptional()
    filters?: Array<any> = [];

    public get skip(): number {
        return (this.page - 1) * this.limit;
    }
}