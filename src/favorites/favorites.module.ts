import { forwardRef, Module } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';
import { AlbumModule } from 'src/album/album.module';
import { ArtistModule } from 'src/artist/artist.module';
import { TrackModule } from 'src/track/track.module';

@Module({
  controllers: [FavoritesController],
  providers: [FavoritesService],
  exports: [FavoritesService],
  imports: [
    forwardRef(() => ArtistModule),
    forwardRef(() => AlbumModule),
    forwardRef(() => TrackModule),
  ],
})
export class FavoritesModule {}
