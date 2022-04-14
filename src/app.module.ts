import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { typeOrmConfigAsync } from './config/typeorm.config';
import { BlogsModule } from './blogs/blogs.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { MailerModule } from '@nestjs-modules/mailer';
import { JwtStrategy } from './auth/guards/jwt-strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt'}),
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config : ConfigService) => ({
        transport: {
          service: config.get<string>('MAILGUN_API_DOMAIN'),
          host: config.get<string>('SMTP_HOST_NAME'),
          port: config.get<number>('EMIAL_PORT'),
          auth: {
            user: config.get<string>('EMAIL_USERNAME'), // generated ethereal user
            pass: config.get<string>('EMIAL_PASSD'), // generated ethereal password
          },
        },
      }),
    }),
    ConfigModule.forRoot({isGlobal: true}),
    TypeOrmModule.forRootAsync(typeOrmConfigAsync),
    BlogsModule,
    UserModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
  exports : [PassportModule, JwtStrategy]
})
export class AppModule {}
