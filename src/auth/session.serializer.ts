import { PassportSerializer } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { User } from './user.entity';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  serializeUser(user: User, done: (err: Error, user: User) => void): any {
    done(null, user);
  }

  deserializeUser(
    payload: User,
    done: (err: Error, payload: any) => void,
  ): any {
    done(null, payload);
  }
}
