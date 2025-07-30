import {BadRequestException, Injectable, UnauthorizedException} from '@nestjs/common';
import {loginDto} from "./dto/registration.dto";
import {UserService} from "../user/user.service";
import {User} from "../user/user.entity";
import {JwtService} from "@nestjs/jwt";
import {isInformationMatching} from "../utils/bcrypt";
import {JwtPayload} from "../types/jwt/jwt";
import {userDto, UserType} from "../types/dto/user.dto";
import {TokensInterface} from "./types/auth.types";
import {ConfigService} from "@nestjs/config";
import {TokenService} from "../token/token.service";

@Injectable()
export class AuthService {

    constructor(private readonly userService: UserService, private readonly jwtService: JwtService,
                private readonly configService: ConfigService,
                private readonly tokenService: TokenService) {
    }

    async registration(dto: userDto): Promise<TokensInterface> {
        const user: UserType = await this.userService.createUser(dto);
        return await this.returnAndUpdateTokens(user);
    }

    async login(dto: loginDto) {
        const user: User | null = await this.userService.findByEmail(dto.email);
        if (!user || !isInformationMatching(dto.password, user.password)) {
            throw new BadRequestException('Invalid email or password');
        }

        return await this.returnAndUpdateTokens(user);

    }

    private generateTokens(user: User | UserType) {
        const payload: JwtPayload = {
            email: user.email,
            sub: user.id
        }

        const accessToken = this.jwtService.sign(payload, {secret: this.configService.get<string>("JWT_SECRET")});
        const refreshToken = this.jwtService.sign(payload, {
            secret: this.configService.get<string>("JWT_SECRET"),
            expiresIn: this.configService.get<string>("JWT_EXPIRATION_REFRESH_TOKEN")
        });

        return {accessToken, refreshToken};
    }

    private async returnAndUpdateTokens(user: User | UserType): Promise<TokensInterface> {
        const tokens = this.generateTokens(user);
        if (tokens) await this.tokenService.createToken(tokens.refreshToken, user)
        return tokens;
    }

    async refreshTokens(refreshToken: string) {
        const user = await this.validateRefreshToken(refreshToken);
        return await this.returnAndUpdateTokens(user);
    }


    async logout(refreshToken: string) {
        const user = await this.validateRefreshToken(refreshToken);
        return await this.tokenService.clearToken(refreshToken, user);
    }

    private async validateRefreshToken(refreshToken: string): Promise<User> {
        try {
            const decoded: JwtPayload = this.jwtService.verify(refreshToken, {
                secret: this.configService.get<string>("JWT_SECRET")
            });

            const user = await this.userService.findById(decoded.sub);
            if (!user) throw new UnauthorizedException("User not found");

            if (!await this.tokenService.checkExisting(refreshToken, user)) {
                throw new UnauthorizedException("Refresh token is invalid");
            }

            return user;
        } catch (error) {
            throw new UnauthorizedException("Token is expired");
        }
    }
}
