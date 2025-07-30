import { Injectable } from '@nestjs/common';
import {TokenService} from "../token/token.service";
import {Cron} from "@nestjs/schedule";

@Injectable()
export class TokenCleanupService {

    constructor(private readonly tokenService: TokenService) {
    }

    @Cron('0 0 * * *')
    async handleExpiredTokenCleanup() {
        await this.tokenService.deleteExpiredTokens();
    }

}
