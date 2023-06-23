import { Injectable } from "@nestjs/common";
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from "passport-local";
import { AuthenticationService } from "../services";
import { UserEntity } from "src/users/entities";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthenticationService) {
        super({
            usernameField: 'email'
        })
    }
    async validate(email: string, password: string): Promise<UserEntity> {
        return this.authService.getAuthenticatedUser(email, password);
    }
}