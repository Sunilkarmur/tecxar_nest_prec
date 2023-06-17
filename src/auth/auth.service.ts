import { Injectable } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { hash, compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/Login.dto';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: any): Promise<User> {
    createUserDto.profile_image = createUserDto.profile_image?.path ?? null;
    const hashedPassword = await hash(createUserDto.password, 10);

    // Check the user exists or not
    const checkUser = await this.userService.findOne(createUserDto.email);
    if (checkUser) {
      throw Error('User Already Registered');
    }

    const payload: any = {
      ...createUserDto,
      password: hashedPassword,
    };
    return this.userService.create(payload);
  }

  async login(loginDto: LoginDto): Promise<any> {
    // Check the user exists or not
    const checkUser = await this.validateUser(
      loginDto.email,
      loginDto.password,
    );
    if (!checkUser) {
      throw Error('Username or Password are invalid');
    }

    const token = await this.generateToken(checkUser);
    return { ...checkUser, token };
  }

  generateToken(payload: any): string | null {
    // Generate a token using the JWT service
    try {
      return this.jwtService.sign(payload, { secret: jwtConstants.secret });
    } catch (error) {
      return null;
    }
  }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findOne(username);
    const isMatch = await compare(pass, user.password);

    if (isMatch) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async getProfile(userId: number): Promise<any> {
    const user = await this.userService.getProfile(userId);
    return user;
  }

  async updateProfile(userId: number, updateUserDto: any): Promise<any> {
    const user = await this.userService.updateProfile(userId, updateUserDto);
    return user;
  }
}
