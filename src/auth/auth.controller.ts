import {Body, Controller, Post, Res} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {userDto} from "../types/dto/user.dto";
import {Response} from "express";

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {}

    @Post("/login")
    async login () {

    }

    @Post("/registration")
    async registration (@Body() userDto: userDto, @Res() res: Response) {
        const {accessToken, refreshToken} = await this.authService.registration(userDto);
        this.setCookies(res, accessToken, refreshToken, "Registration successfully");

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

        res.status(201).send({message})
    }

}
