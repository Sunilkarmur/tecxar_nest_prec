import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private users: Repository<User>,
  ) {}

  async create(user: User): Promise<User> {
    this.users.save(user);
    return user;
  }

  async findOne(email: string): Promise<User | undefined> {
    return await this.users.findOne({ where: { email } });
  }

  async login(email: string, password: string): Promise<User | undefined> {
    return await this.users.findOne({ where: { email, password } });
  }

  async getProfile(userId: number): Promise<User | undefined> {
    return await this.users.findOne({ where: { id: userId } });
  }

  async updateProfile(userId: number, updateUserDto: any): Promise<boolean> {
    try {
      const response = await this.users.update(userId, updateUserDto);
      return true;
    } catch (error) {
      return false;
    }
  }
}
