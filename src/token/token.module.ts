import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import {Token} from "./token.entity";
import {TypeOrmModule} from "@nestjs/typeorm";

@Module({
  providers: [TokenService],
  imports: [TypeOrmModule.forFeature([Token])],
  exports: [TokenService],
})
export class TokenModule {}
