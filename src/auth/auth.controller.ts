import {Controller, Post, Req, Res} from '@nestjs/common';
import {AuthService} from "./auth.service";

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {}

    @Post("/login")
    async login (@Req() req, @Res() res: Response) {

    }


}
