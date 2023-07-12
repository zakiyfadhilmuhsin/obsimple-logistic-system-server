import { Body, Controller, Get, Put, Query, UseGuards } from "@nestjs/common";
import { InventoryService } from "../services";
import { JwtAuthGuard } from "src/authentication/guards";
import { PageOptionsDto } from "src/common/dtos";
import { UpdateStockDto } from "../dtos";

@Controller('inventories')
export class InventoryController {
    constructor(private readonly inventoryService: InventoryService) {}

    @Get('stock-list')
    @UseGuards(JwtAuthGuard)
    async getStockList(@Query() pageOptionsDto: PageOptionsDto) {
        return await this.inventoryService.getStockList(pageOptionsDto);
    }

    @Put('update-stock')
    async updatestock(@Body() updateStockDto: UpdateStockDto) {
        return await this.inventoryService.updateStock(updateStockDto);
    }

    @Get('stock-record-list')
    @UseGuards(JwtAuthGuard)
    async getStockRecordList(@Query() pageOptionsDto: PageOptionsDto) {
        return await this.inventoryService.getStockRecordList(pageOptionsDto);
    }

    @Get('export-stock-list')
    @UseGuards(JwtAuthGuard)
    async getExportStockList() {
        return await this.inventoryService.exportStockList();
    }

    @Get('export-stock-record-list')
    @UseGuards(JwtAuthGuard)
    async getExportStockRecordList() {
        return await this.inventoryService.exportStockRecordList();
    }
}