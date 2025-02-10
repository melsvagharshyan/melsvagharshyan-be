import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MessagesModule } from './messages/messages.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MessagesModule,
    MongooseModule.forRoot(process.env.DATABASE_URL || ''),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
