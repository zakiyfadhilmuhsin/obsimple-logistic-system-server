import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../database/database.module';
import { UsersModule } from '../users/users.module';
import * as Joi from '@hapi/joi';
import { AuthenticationModule } from '../authentication/authentication.module';
import { ProductsModule } from '../products/products.module';
import { InventoriesModule } from 'src/inventories/inventories.module';
import { WarehousesModule } from 'src/warehouses/warehouses.module';
import { ReportsModule } from 'src/reports/reports.module';
import { ShipmentModule } from 'src/shipment/shipment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        PORT: Joi.number(),

        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION_TIME: Joi.string().required()
      })
    }), 
    DatabaseModule, 
    UsersModule,
    AuthenticationModule,
    ProductsModule,
    InventoriesModule,
    WarehousesModule,
    ReportsModule,
    ShipmentModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
