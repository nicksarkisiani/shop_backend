import {Injectable, UnauthorizedException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Token} from "./token.entity";
import {LessThan, Repository} from "typeorm";
import {User} from "../user/user.entity";
import {encodeInformation, isInformationMatching} from "../utils/bcrypt";
import {ConfigService} from "@nestjs/config";
import {UserType} from "../types/dto/user.dto";

@Injectable()
export class TokenService {

    constructor(@InjectRepository(Token) private readonly tokenRepository: Repository<Token>,
                private readonly configService: ConfigService) {
    }


    async checkExisting(refreshToken: string, user: User) {
        const id = await this.findRefreshToken(refreshToken, user);
        return !!id;
    }

    private async getRefreshTokens(user: User | UserType) {
        const tokens = await this.tokenRepository.find({where: {user: {id: user.id}}});
        return tokens;
    }

    private async findRefreshToken(refreshToken: string, user: User | UserType) {
        const tokens = await this.getRefreshTokens(user);
        for(let token of tokens) {
            if(isInformationMatching(refreshToken, token.refreshToken)) {
                return token.id;
            }
        }
        return null;
    }

    async clearToken(refreshToken: string, user: User | UserType) {
        const id = await this.findRefreshToken(refreshToken, user);
        if(!id){
            throw new UnauthorizedException("Refresh token is invalid");
        }

        await this.tokenRepository.delete({id});
    }
    private async checkAvailability(user: User | UserType) {
        const tokens = await this.getRefreshTokens(user);
        const maxSessions = this.configService.get<number>('MAX_SESSIONS') || 2;
        return tokens.length < maxSessions;
    }

    private async deleteOldToken(user: User | UserType) {
        const tokens = await this.getRefreshTokens(user);
        const oldest = tokens.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())[0];
        await this.tokenRepository.remove(oldest);

    }

    async deleteExpiredTokens() {
        const now = new Date();
        await this.tokenRepository.delete({
            expiresAt: LessThan(now),
        });
    }

    async createToken(refreshToken: string, user: User | UserType) {
        await this.deleteExpiredTokens();
        if(!(await this.checkAvailability(user))) await this.deleteOldToken(user)

        const hashedToken = encodeInformation(refreshToken);
        const tokenLifeTime = parseInt(this.configService.get<string>("REFRESH_TOKEN_AGE") || '604800000', 10);
        const expiresAt = new Date(Date.now() + tokenLifeTime);
        const tokenEntity = this.tokenRepository.create({
            user,
            refreshToken: hashedToken,
            expiresAt,
        })
        return await this.tokenRepository.save(tokenEntity);
    }

}
