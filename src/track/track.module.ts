import { Module } from '@nestjs/common';
import { TrackService } from './track.service';
import { TrackController } from './track.controller';
import { FavoritesService } from 'src/favorites/favorites.service';

@Module({
  controllers: [TrackController],
  providers: [TrackService],
  exports: [TrackService],
  imports: [FavoritesService],
})
export class TrackModule {}
