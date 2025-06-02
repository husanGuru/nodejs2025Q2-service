import { Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { FavoritesService } from 'src/favorites/favorites.service';
import { TrackService } from 'src/track/track.service';

@Module({
  controllers: [AlbumController],
  providers: [AlbumService],
  exports: [AlbumService],
  imports: [FavoritesService, TrackService],
})
export class AlbumModule {}
