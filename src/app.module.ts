import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmConfigService } from './database';
import { HistoryModule } from './history/history.module';
import { VocabularyModule } from './vocabulary/vocabulary.module';
import { QuizModule } from './quiz/quiz.module';
import { TopicModule } from './topic/topic.module';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailerConfigService } from './mail';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'dev'}`,
    }),

    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),

    MailerModule.forRootAsync({
      useClass: MailerConfigService,
    }),

    AuthModule,
    UsersModule,
    TopicModule,
    QuizModule,
    VocabularyModule,
    HistoryModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
