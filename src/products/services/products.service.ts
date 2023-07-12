import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from '../dtos/create-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from '../entities';
import { Repository } from 'typeorm';
import { PageOptionsDto } from 'src/common/dtos';
import { StockEntity } from 'src/inventories/entities';
import { datatableGetItems } from 'src/common/functions';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(ProductEntity) private productsRepository: Repository<ProductEntity>,
        @InjectRepository(StockEntity) private stocksRepository: Repository<StockEntity>
    ) {}

    async create(createProductDto: CreateProductDto) {
        // Create Product
        const newProduct = await this.productsRepository.create(createProductDto);
        const createdProduct = await this.productsRepository.save(newProduct);

        // Create Stock
        const newStock = await this.stocksRepository.create({
            available_stock: createProductDto.stock,
            product: createdProduct
        });
        await this.stocksRepository.save(newStock);

        return newProduct;
    }

    async findAll(pageOptionsDto: PageOptionsDto) {
        // Relation
        const relations = [{ path: 'warehouse_return' }];

        return datatableGetItems(this.productsRepository, "products", pageOptionsDto, relations);
    }

    async findOne(id: number) {
        const post = await this.productsRepository.findOne({ where: {id: id} });
        if(post) {
            return post;
        }
        throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }

    async findProductByBarcode(barcode: string) {
        const product = await this.productsRepository.findOne({ where: {barcode: barcode} });
        if(product) {
            return product;
        }
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }

    async update(id: number, updatePostDto: UpdateProductDto) {
        await this.productsRepository.update(id, updatePostDto);
        const updatedPost = await this.productsRepository.findOne({ where: { id: id } });
        if(updatedPost) {
            return updatedPost;
        }
        throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }

    async remove(id: number) {
        const stock = await this.stocksRepository.findOne({  where: { product: { id: id } }, relations: ['product'] });

        await this.stocksRepository.delete(stock.id);
        const deleteResponse = await this.productsRepository.delete(id);
        if(!deleteResponse.affected) {
            throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
        }else{
            return deleteResponse;
        }
    }

    async exportProducts() {
        return await this.productsRepository.find();
    }
}
