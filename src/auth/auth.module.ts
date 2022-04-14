import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RolesGuard } from './guards/roles.guard';
import { JwtAuthGuard } from './guards/jwt-guard';
import { JwtStrategy } from './guards/jwt-strategy';

@Module({
  imports: [
    forwardRef(() => UserModule),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (confogService : ConfigService) => ({
        secret: confogService.get('JWT_SECRET'),
        signOptions: {expiresIn: '10000s'}
      }),
    }),

  ],
  controllers: [AuthController],
  providers: [AuthService, RolesGuard,JwtAuthGuard,JwtStrategy,],
  exports: [AuthService,JwtStrategy],
})
export class AuthModule {}
