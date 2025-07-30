import {Body, Controller, Post, Request, Res, UnauthorizedException} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {userDto} from "../types/dto/user.dto";
import {Response, Request as RequestType} from "express";
import {loginDto} from "./dto/registration.dto";

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {}

    // here can appear problem that when user logged in account on one device and we save his refreshToken in cookie,
    // and then logged in account using another device, he couldn't do nothing in the first device because refreshToken stored
    // in cookie isn't matched to hash of new refreshToken, so he would get every time error that the info of his is incorrect
    // so in verify method we need to implement algorithm of clearing incorrect cookies and suggest user to relogin again

    @Post("/login")
    async login (@Body() loginDto: loginDto, @Res() res: Response) {
        const {accessToken, refreshToken} = await this.authService.login(loginDto);
        this.setCookies(res, accessToken, refreshToken, "Login successfully");
    }

    @Post("/registration")
    async registration (@Body() userDto: userDto, @Res() res: Response) {
        const {accessToken, refreshToken} = await this.authService.registration(userDto);
        this.setCookies(res, accessToken, refreshToken, "Registration successfully");

    }

    @Post("/logout")
    async logout (@Request() req: RequestType, @Res() res: Response) {
        const accessToken = req.cookies["accessToken"];
        const refreshToken = req.cookies["refreshToken"];
        if(!refreshToken || !accessToken){
            throw new UnauthorizedException("User isn't logged in");
        }
        await this.authService.logout(refreshToken);
        this.clearCookies(res, "Logout successfully");

    }

    @Post("/verify")
    async verify(@Request() req: RequestType, @Res() res: Response) {
        const refreshToken = req.cookies["refreshToken"];
        if(!refreshToken){
            throw new UnauthorizedException("Refresh token not found");
        }
        const tokens = await this.authService.refreshTokens(refreshToken);
        this.setCookies(res, tokens.accessToken, tokens.refreshToken, "Refresh successfully");
    }

// here can appear problem that db still store refreshToken
    clearCookies(res: Response, message: string) {
        res.clearCookie("accessToken", {
            httpOnly: true,
            secure: !!process.env.SECURE,
            sameSite: "none",
            domain: process.env.API_URL,
            path: "/"
        })

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: !!process.env.SECURE,
            sameSite: "none",
            domain: process.env.API_URL,
            path: "/"
        })

        res.status(200).send({message});
    }

    setCookies(res: Response, accessToken: string, refreshToken: string, message: string) {
        const accessTokenAge = parseInt(process.env.ACCESS_TOKEN_AGE || "3600000", 10)
        const refreshTokenAge = parseInt(process.env.REFRESH_TOKEN_AGE || "604800000", 10)
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: !!process.env.SECURE,
            maxAge: accessTokenAge,
            sameSite: "none",
            domain: process.env.API_URL,
            path: "/"
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: !!process.env.SECURE,
            maxAge: refreshTokenAge,
            sameSite: "none",
            domain: process.env.API_URL,
            path: "/"
        })

        res.status(200).send({message})
    }

}
