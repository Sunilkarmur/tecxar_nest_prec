import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';
import { jwtConstants } from './constants';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../', 'uploads'), // Specify the path to the directory where the uploaded images are stored
      serveRoot: '/uploads', // Specify the URL path prefix for serving the static files
    }),
    JwtModule.register({
      secret: jwtConstants.secret, // Replace with your own secret key
      signOptions: { expiresIn: '1d' }, // Token expiration time
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, UserService],
})
export class AuthModule {}
