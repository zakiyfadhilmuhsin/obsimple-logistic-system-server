import { Body, Controller, Get, Post, Query, UseGuards } from "@nestjs/common";
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
        return this.inboundService.getInboundList(pageOptionsDto);
    }
}