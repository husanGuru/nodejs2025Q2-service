import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { FavoritesModule } from './favorites/favorites.module';
import { TrackModule } from './track/track.module';
import { AlbumModule } from './album/album.module';
import { ArtistModule } from './artist/artist.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { LoggerModule } from './logger/logger.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigService available globally
    }),
    DatabaseModule,
    UserModule,
    ArtistModule,
    AlbumModule,
    TrackModule,
    FavoritesModule,
    AuthModule,
    LoggerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
