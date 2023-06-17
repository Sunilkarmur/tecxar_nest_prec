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
  UseInterceptors,
  UploadedFile,
  Req,
} from '@nestjs/common';
import { Multer } from 'multer';
import { ProductService } from './product.service';
import { CreateProductDto, UpdateProductDto } from './product.dto';
import { AuthGuard } from '@nestjs/passport';
import { errorResponse, successResponse } from 'src/auth/common.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/utils/multer.config';
import {
  createProductSchema,
  updateProductSchema,
} from './validation/product.schema';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getAllProducts(@Res() res) {
    const response = await this.productService.getAllProducts();
    return res
      .status(200)
      .send(successResponse({ item: response }, 'Product List'));
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async getProductById(@Param('id') id: number, @Res() res) {
    const response = await this.productService.getProductById(id);
    return res
      .status(200)
      .send(successResponse({ item: response }, 'Product Detail'));
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('image', multerConfig))
  async createProduct(
    @Req() req: Request,
    @UploadedFile() file: Multer.File,
    @Res() res,
  ) {
    try {
      const createProductDto: any = { ...req.body, image: file };
      await createProductSchema.validate(createProductDto, {
        abortEarly: false,
      });
      const response = await this.productService.createProduct({
        ...createProductDto,
        image: file.path,
      });
      return res
        .status(200)
        .send(
          successResponse({ item: response }, 'Product Added successfully'),
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
  async updateProduct(
    @Param('id') id: number,
    @Body() updateProductDto: UpdateProductDto,
    @Res() res,
  ) {
    try {
      await updateProductSchema.validate(updateProductDto, {
        abortEarly: false,
      });
      const response = await this.productService.updateProduct(
        id,
        updateProductDto,
      );
      return res
        .status(200)
        .send(
          successResponse({ item: response }, 'Product Added successfully'),
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
  async deleteProduct(@Param('id') id: number, @Res() res) {
    try {
      const response = await this.productService.deleteProduct(id);
      return res
        .status(200)
        .send(successResponse({ item: [] }, 'Product Deleted successfully'));
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
