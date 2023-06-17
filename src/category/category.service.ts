import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity/category.entity';
import { CreateCategoryDto, UpdateCategoryDto } from './category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  getAllCategories(): Promise<Category[]> {
    return this.categoryRepository.find();
  }

  getCategoryById(id: number): Promise<Category> {
    return this.categoryRepository.findOne({ where: { id } });
  }

  createCategory(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = this.categoryRepository.create(createCategoryDto);
    return this.categoryRepository.save(category);
  }

  async updateCategory(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const categoryToUpdate = await this.categoryRepository.findOne({
      where: { id },
    });
    if (!categoryToUpdate) {
      // Handle error or throw NotFoundException
    }
    const updatedCategory = {
      ...categoryToUpdate,
      ...updateCategoryDto,
    };
    return this.categoryRepository.save(updatedCategory);
  }

  async deleteCategory(id: number): Promise<void> {
    await this.categoryRepository.delete(id);
  }
}
