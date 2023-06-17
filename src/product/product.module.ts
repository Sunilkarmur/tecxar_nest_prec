import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity/product.entity';
import { Category } from 'src/category/category.entity/category.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Product, Category])],
  controllers: [ProductController],
  providers: [ProductService]
})
export class ProductModule {}
