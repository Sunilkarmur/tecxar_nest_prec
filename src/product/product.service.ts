import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity/product.entity';
import { CreateProductDto, UpdateProductDto } from './product.dto';
import { Category } from 'src/category/category.entity/category.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  getAllProducts(): Promise<Product[]> {
    return this.productRepository.find({ relations: ['category_id'] });
  }

  getProductById(id: number): Promise<Product> {
    return this.productRepository.findOne({ where: { id } });
  }

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    const category = await this.categoryRepository.findOne({
      where: { id: createProductDto.categoryIdId },
    });
    if (!category) {
      return Promise.reject('Invalid Category Id');
    }
    const product = this.productRepository.create({
      ...createProductDto,
      category_id: createProductDto.categoryIdId,
    });
    return this.productRepository.save(product);
  }

  async updateProduct(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    console.log(updateProductDto);    
    const category = await this.categoryRepository.findOne({
      where: { id: updateProductDto.categoryIdId },
    });
    if (!category) {
      return Promise.reject('Invalid Category Id');
    }
    const productToUpdate = await this.productRepository.findOne({
      where: { id },
    });
    if (!productToUpdate) {
      // Handle error or throw NotFoundException
    }
    const updatedProduct = {
      ...productToUpdate,
      ...updateProductDto,
      image: productToUpdate.image,
      categoryIdId: updateProductDto.categoryIdId
    };
    console.log(updatedProduct)
    return this.productRepository.save(updatedProduct);
  }

  async deleteProduct(id: number): Promise<void> {
    await this.productRepository.delete(id);
  }
}
