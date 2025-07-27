import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import {TypeOrmModule} from "@nestjs/typeorm";
import {JwtModule} from "@nestjs/jwt";
import {User} from "./user/user.entity";
import {ConfigModule} from "@nestjs/config";

@Module({
  imports: [AuthModule, UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'root',
    database: 'shop',
    entities: [User],
    synchronize: true,
  }),
  JwtModule.register({
    global: true,
    secret: process.env.JWT_SECRET,
    signOptions: {expiresIn: process.env.JWT_EXPIRATION_ACCESS_TOKEN}
  })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

