import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import {TypeOrmModule} from "@nestjs/typeorm";
import {JwtModule} from "@nestjs/jwt";
import {User} from "./user/user.entity";
import {ConfigModule} from "@nestjs/config";
import { TokenModule } from './token/token.module';
import {Token} from "./token/token.entity";
import {ScheduleModule} from "@nestjs/schedule";
import { SchedulerModule } from './scheduler/scheduler.module';
import { TokenCleanupService } from './scheduler/token-cleanup.service';

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
    entities: [User, Token],
    synchronize: true,
  }),
  JwtModule.register({
    global: true,
    secret: process.env.JWT_SECRET,
    signOptions: {expiresIn: process.env.JWT_EXPIRATION_ACCESS_TOKEN}
  }),
    TokenModule,
  ScheduleModule.forRoot(),
  SchedulerModule
  ],
  controllers: [AppController],
  providers: [AppService, TokenCleanupService],
})
export class AppModule {}

