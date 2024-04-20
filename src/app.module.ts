import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configService } from './config/configuration.service';
import { AllModules } from 'src';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    MailerModule.forRoot(configService.smtpEmailConfig()),
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    ...AllModules,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
