import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { WarehouseService } from "../services";
import { JwtAuthGuard } from "src/authentication/guards";
import { PageOptionsDto } from "src/common/dtos";

@Controller('warehouses')
export class WarehouseController {
    constructor(private readonly warehouseService: WarehouseService) {}

    @Get('stock-in-out-list')
    @UseGuards(JwtAuthGuard)
    async getStockRecordList(@Query() pageOptionsDto: PageOptionsDto) {
        return await this.warehouseService.getStockInOutRecord(pageOptionsDto);
    }
}