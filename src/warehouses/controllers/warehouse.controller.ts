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

    @Get('return-list')
    @UseGuards(JwtAuthGuard)
    async getReturnList(@Query() pageOptionsDto: PageOptionsDto) {
        return await this.warehouseService.getReturn(pageOptionsDto);
    }

    @Get('export-stock-in-out-list')
    @UseGuards(JwtAuthGuard)
    async getExportStockInOutList() {
        return await this.warehouseService.exportStockInOutList();
    }

    @Get('export-return-list')
    @UseGuards(JwtAuthGuard)
    async getExportReturnList() {
        return await this.warehouseService.exportReturnList();
    }
}