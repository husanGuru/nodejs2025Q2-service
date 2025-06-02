import { forwardRef, Module } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { ArtistController } from './artist.controller';
import { FavoritesModule } from 'src/favorites/favorites.module';
import { TrackModule } from 'src/track/track.module';
import { AlbumModule } from 'src/album/album.module';

@Module({
  controllers: [ArtistController],
  providers: [ArtistService],
  exports: [ArtistService],
  imports: [forwardRef(() => FavoritesModule), TrackModule, AlbumModule],
})
export class ArtistModule {}
