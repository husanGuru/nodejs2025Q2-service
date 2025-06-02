import { Module } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';
import { AlbumModule } from 'src/album/album.module';
import { ArtistModule } from 'src/artist/artist.module';
import { TrackModule } from 'src/track/track.module';

@Module({
  controllers: [FavoritesController],
  providers: [FavoritesService],
  imports: [ArtistModule, AlbumModule, TrackModule],
  exports: [FavoritesService],
})
export class FavoritesModule {}
