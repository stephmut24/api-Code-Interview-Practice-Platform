/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        let secret = configService.get('JWT_SECRET');

        // Si pas de secret ou secret invalide, utilise un défaut
        if (!secret || secret.length < 32) {
          console.warn(
            '⚠️ Using fallback JWT secret. Please set JWT_SECRET in .env',
          );
          secret = 'fallback_super_secure_jwt_secret_for_dev_1234567890';
        }

        // Nettoie le secret des caractères non-ASCII et caractères de contrôle
        secret = secret
          .normalize('NFD') // Décompose les caractères accentués
          .replace(/[\u0300-\u036f]/g, '') // Enlève les accents
          .replace(/[^\x20-\x7E]/g, '') // Garde seulement ASCII imprimable
          .replace(/[\n\r\t]/g, '') // Enlève les sauts de ligne
          .trim();

        // Vérifie la longueur après nettoyage
        if (secret.length < 32) {
          console.error(
            '❌ JWT_SECRET too short after cleaning:',
            secret.length,
            'chars',
          );
          // Étend le secret si trop court
          while (secret.length < 32) {
            secret += secret;
          }

          secret = secret.substring(0, 32);
        }

        console.log('🔐 JWT Secret configured, length:', secret.length);

        return {
          secret,
          signOptions: {
            expiresIn: configService.get('JWT_EXPIRATION') || '1h',
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
