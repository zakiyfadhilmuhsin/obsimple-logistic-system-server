import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { OutboundService } from "../services/outbound.service";
import { JwtAuthGuard } from "src/authentication/guards";
import { PageOptionsDto } from "src/common/dtos";
import { CreateOutboundDto } from "../dtos";

@Controller('outbound')
export class OutboundController {
    constructor(private readonly outboundService: OutboundService) {}

    @Post('create')
    async createOutbound(@Body() createOutboundDto: CreateOutboundDto) {
        return this.outboundService.createOutbound(createOutboundDto);
    }

    @Get('list')
    @UseGuards(JwtAuthGuard)
    async getOutboundList(@Query() pageOptionsDto: PageOptionsDto) {
        return this.outboundService.getOutboundList(pageOptionsDto);
    }

    @Get('get-outbound-by-id/:id')
    @UseGuards(JwtAuthGuard)
    async getOutboundById(@Param('id') id: number) {
        return await this.outboundService.getOutboundById(id);
    }

    @Put('process-pickup')
    async ProcessPickup(@Body() body: any) {
        return await this.outboundService.processPickup(body);
    }

    @Get('export-outbound-list')
    @UseGuards(JwtAuthGuard)
    async getExportOutboundList() {
        return await this.outboundService.exportOutboundList();
    }
}