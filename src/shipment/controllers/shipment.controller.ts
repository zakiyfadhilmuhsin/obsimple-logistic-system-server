import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { ShipmentService } from "../services/shipment.service";
import { CreateShipmentDto } from "../dtos";
import { PageOptionsDto } from "src/common/dtos";

@Controller('shipment')
export class ShipmentController {
    constructor(
        private readonly shipmentService: ShipmentService
    ) {}

    /**
     *  Create Shipment
     */
    @Post()
    create(@Body() createShipmentDto: CreateShipmentDto) {
        return this.shipmentService.createShipment(createShipmentDto);
    }

    /**
     *  Get All Shipment
     */
    @Get('list')
    findAll(@Query() pageOptionsDto: PageOptionsDto) {
        return this.shipmentService.findAll(pageOptionsDto);
    }
}