import { Body, Controller, Get, Param, Post, Query, UseGuards } from "@nestjs/common";
import { InboundService } from "../services/inbound.service";
import { CreateInboundDto } from "../dtos";
import { PageOptionsDto } from "src/common/dtos";
import { JwtAuthGuard } from "src/authentication/guards";

@Controller('inbound')
export class InboundController {
    constructor(private readonly inboundService: InboundService) {}

    @Post('create')
    async createInbound(@Body() createInboundDto: CreateInboundDto) {
        return this.inboundService.createInbound(createInboundDto);
    }

    @Get('list')
    @UseGuards(JwtAuthGuard)
    async getInboundList(@Query() pageOptionsDto: PageOptionsDto) {
        if((pageOptionsDto as any).inbound_type) {
            pageOptionsDto.filters.push({
                key: 'inbound_type',
                value: (pageOptionsDto as any).inbound_type
            })
        }
        
        return this.inboundService.getInboundList(pageOptionsDto);
    }

    @Get('get-inbound-by-id/:id')
    @UseGuards(JwtAuthGuard)
    async getInboundById(@Param('id') id: number) {
        return await this.inboundService.getInboundById(id);
    }

    @Get('export-inbound-list')
    @UseGuards(JwtAuthGuard)
    async getExportInboundList() {
        return await this.inboundService.exportInboundList();
    }
}