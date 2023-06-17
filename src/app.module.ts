import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { UserService } from './auth/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { databaseConfig } from './config/dbConfig';
import { User } from './auth/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: databaseConfig.host,
      port: databaseConfig.port,
      username: databaseConfig.username,
      password: databaseConfig.password,
      database: databaseConfig.database,
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // Specify the location of your entity files
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User]),
    AuthModule,
    CategoryModule,
    ProductModule,
  ],
  controllers: [AuthController, UsersController],
  providers: [AuthService, UserService, JwtService, UsersService],
})
export class AppModule {}
