import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MessagesModule } from './messages/messages.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { RecommendationModule } from './recommendation/recommendation.module';
import 'dotenv/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(
      `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@cluster0.jedxf.mongodb.net`,
    ),
    // MongooseModule.forRoot(
    //   `mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@shinkansen.proxy.rlwy.net:30629`,
    // ),
    // MongooseModule.forRoot(
    //   `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@recommendations.global.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000`,
    // ),
    MessagesModule,
    RecommendationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
