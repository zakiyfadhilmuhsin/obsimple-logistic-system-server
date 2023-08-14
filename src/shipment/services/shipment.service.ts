import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ShipmentEntity } from "../entities";
import { Repository } from "typeorm";
import { CreateShipmentDto } from "../dtos";
import { datatableGetItems } from "src/common/functions";
import { PageOptionsDto } from "src/common/dtos";

@Injectable()
export class ShipmentService {
    constructor(
        @InjectRepository(ShipmentEntity) private shipmentRepository: Repository<ShipmentEntity>
    ) {}

    /**
     *  Create Shipment
     */
    async createShipment(inputData: CreateShipmentDto) {
        // Check Exist Data
        const checkExist = await this.shipmentRepository.findOne({
            where: {
                shipment_number: inputData.shipment_number
            }
        });
        if(checkExist) {
            throw new HttpException('Shipment number are exist!', HttpStatus.NOT_FOUND);
        } else {
            // Create Shipment
            const createdShipment = await this.shipmentRepository.create(inputData);

            // Save Shipment
            await this.shipmentRepository.save(createdShipment);

            return createdShipment;
        }
    }

    async findAll(pageOptionsDto: PageOptionsDto) {
        // Relation
        //const relations = [{ path: 'warehouse_return' }];

        return datatableGetItems(this.shipmentRepository, "shipment", pageOptionsDto, null);
    }
}