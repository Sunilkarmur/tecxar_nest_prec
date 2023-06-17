import {
  Controller,
  Get,
  Patch,
  Put,
  Req,
  Request,
  Res,
  Response,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service';
import { errorResponse, successResponse } from 'src/auth/common.service';
import {
  registrationSchema,
  updateSchema,
} from 'src/auth/validation/registration.schema';

@Controller('users')
export class UsersController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@Req() req, @Res() res): Promise<any> {
    const users = await this.authService.getProfile(req.user.id);
    console.log(req.user);
    return res
      .status(200)
      .send(successResponse({ item: users }, 'Get Profile detail'));
  }

  @Patch('edit-profile/:id')
  @UseGuards(AuthGuard('jwt'))
  async editProfile(@Request() req: any, @Response() res: any): Promise<any> {
    try {
      const updateUserDto: any = req.body;
      const userId = req.params.id;
      await updateSchema.validate(updateUserDto, { abortEarly: false });
      const response = await this.authService.updateProfile(
        userId,
        updateUserDto,
      );
      console.log(response);
      return res
        .status(200)
        .send(
          successResponse(
            { item: response },
            response
              ? 'Your profile is update successfully'
              : 'Email is already registrated',
          ),
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
