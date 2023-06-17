import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  Post,
  Req,
  Request,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Multer } from 'multer';
import {
  loginSchema,
  registrationSchema,
} from './validation/registration.schema';
import { errorResponse, successResponse } from './common.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { LoginDto } from './dto/Login.dto';
import { multerConfig } from 'src/utils/multer.config';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UseInterceptors(FileInterceptor('profile_image', multerConfig))
  async register(
    @Req() req: Request,
    @UploadedFile() file: Multer.File,
    @Res() res,
  ) {
    try {
      const createUserDto: any = { ...req.body, profile_image: file };
      await registrationSchema.validate(createUserDto, { abortEarly: false });
      const response = await this.authService.register(createUserDto);
      return res
        .status(200)
        .send(
          successResponse({ item: response }, 'Your registration successfully'),
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

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res) {
    try {
      await loginSchema.validate(loginDto, { abortEarly: false });
      const token = await this.authService.login(loginDto);
      return res
        .status(200)
        .send(
          successResponse({ item: token }, 'Your registration successfully'),
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
}
