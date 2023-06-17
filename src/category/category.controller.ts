import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Res,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto, UpdateCategoryDto } from './category.dto';
import { AuthGuard } from '@nestjs/passport';
import { errorResponse, successResponse } from 'src/auth/common.service';
import {
  createCategorySchema,
  updateCategorySchema,
} from './validation/category.schema';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getAllCategories(@Res() res) {
    const response = await this.categoryService.getAllCategories();
    return res
      .status(200)
      .send(successResponse({ item: response }, 'Catgory List'));
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async getCategoryById(@Param('id') id: number, @Res() res) {
    const response = await this.categoryService.getCategoryById(id);
    return res
      .status(200)
      .send(successResponse({ item: response }, 'Catgory List'));
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
    @Res() res,
  ) {
    try {
      await createCategorySchema.validate(createCategoryDto, {
        abortEarly: false,
      });
      const response = await this.categoryService.createCategory(
        createCategoryDto,
      );
      return res
        .status(200)
        .send(
          successResponse({ item: response }, 'Catgory Added successfully'),
        );
    } catch (error) {
      return res
        .status(422)
        .send(
          errorResponse(
            error?.errors?.[0] ?? error,
            422,
            error?.errors ?? error,
          ),
        );
    }
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  async updateCategory(
    @Param('id') id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Res() res,
  ) {
    try {
      await updateCategorySchema.validate(updateCategoryDto, {
        abortEarly: false,
      });
      const response = await this.categoryService.updateCategory(
        id,
        updateCategoryDto,
      );
      return res
        .status(200)
        .send(
          successResponse({ item: response }, 'Catgory Update successfully'),
        );
    } catch (error) {
      return res
        .status(422)
        .send(
          errorResponse(
            error?.errors?.[0] ?? error,
            422,
            error?.errors ?? error,
          ),
        );
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async deleteCategory(@Param('id') id: number, @Res() res) {
    try {
      const response = await this.categoryService.deleteCategory(id);
      return res
        .status(200)
        .send(successResponse({ item: [] }, 'Catgory Deleted successfully'));
    } catch (error) {
      return res
        .status(422)
        .send(
          errorResponse(
            error?.errors?.[0] ?? error,
            422,
            error?.errors ?? error,
          ),
        );
    }
  }
}
