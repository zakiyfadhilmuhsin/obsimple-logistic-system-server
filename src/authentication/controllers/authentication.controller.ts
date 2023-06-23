import { Body, Controller, Get, HttpCode, Post, Req, Res, UseGuards } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { AuthenticationService } from '../services';
import { JwtAuthGuard, LocalAuthGuard } from '../guards';
import { RegisterDTO } from '../dtos';
import { RequestWithUser } from '../interfaces';

@Controller('authentication')
export class AuthenticationController {
    constructor(private readonly authenticationService: AuthenticationService) {}

    /**
     *  Register
     */
    @Post('register')
    async register(@Body() registrationData: RegisterDTO) {
        return this.authenticationService.register(registrationData);
    }

    /**
     *  Login
     */
    @HttpCode(200)
    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(
        @Req() request: RequestWithUser, 
        @Res({ passthrough: true }) response: FastifyReply
    ) {
        const { user } = request;
        const cookie = this.authenticationService.getCookieWithJwtToken(user.id);
        response.header('Set-Cookie', cookie);
        user.password = undefined;
        return response.send(user);
    }

    /**
     *  Logout
     */
    @UseGuards(JwtAuthGuard)
    @Post('logout')
    async logout(
        @Req() request: RequestWithUser, 
        @Res({ passthrough: true }) response: FastifyReply) 
    {
        response.header('Set-Cookie', this.authenticationService.getCookieForLogOut());
        return HttpCode(200);
    }

    /**
     *  Authenticate
     */
    @UseGuards(JwtAuthGuard)
    @Get()
    authenticate(@Req() request: RequestWithUser) {
        const user = request.user;
        user.password = undefined;
        return user;
    }
}
