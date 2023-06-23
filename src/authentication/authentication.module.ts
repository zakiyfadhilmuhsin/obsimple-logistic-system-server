import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthenticationController } from './controllers';
import { AuthenticationService } from './services';
import { JwtStrategy, LocalStrategy } from './strategies';

@Module({
  imports: [
    UsersModule, 
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: `${configService.get('JWT_EXPIRATION_TIME')}`
        }
      })
    })
  ],
  controllers: [AuthenticationController],
  providers: [
    AuthenticationService, 
    LocalStrategy, 
    JwtStrategy
  ]
})
export class AuthenticationModule {}
