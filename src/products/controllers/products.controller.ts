import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ProductsService } from '../services/products.service';
import { CreateProductDto } from '../dtos/create-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { JwtAuthGuard } from 'src/authentication/guards';
import { PageOptionsDto } from 'src/common/dtos';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}

    @Post()
    create(@Body() createProductDto: CreateProductDto) {
        return this.productsService.create(createProductDto);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    findAll(@Query() pageOptionsDto: PageOptionsDto) {
        return this.productsService.findAll(pageOptionsDto);
    }

    @Get('scan-barcode/:barcode')
    findProductByBarcode(@Param('barcode') barcode: string) {
        return this.productsService.findProductByBarcode(barcode);
    }
}
