import { forwardRef, Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { FavoritesModule } from 'src/favorites/favorites.module';
import { TrackModule } from 'src/track/track.module';

@Module({
  controllers: [AlbumController],
  providers: [AlbumService],
  exports: [AlbumService],
  imports: [forwardRef(() => FavoritesModule), TrackModule],
})
export class AlbumModule {}
