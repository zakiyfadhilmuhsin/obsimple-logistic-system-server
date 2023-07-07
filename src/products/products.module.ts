import { Module } from '@nestjs/common';
import { ProductsController } from './controllers';
import { ProductsService } from './services';
import { ProductEntity } from './entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockEntity } from 'src/inventories/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity, StockEntity]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService]
})
export class ProductsModule {}
