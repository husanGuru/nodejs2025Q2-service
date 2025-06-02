import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import { FavoritesService } from 'src/favorites/favorites.service';
import { TrackService } from 'src/track/track.service';
import { AlbumService } from 'src/album/album.service';

@Injectable()
export class ArtistService {
  constructor(
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
    private readonly trackService: TrackService,
    private readonly albumService: AlbumService,
  ) {}

  artists: Artist[] = [];

  create(createArtistDto: CreateArtistDto) {
    const artist = new Artist({
      id: crypto.randomUUID(),
      name: createArtistDto.name,
      grammy: createArtistDto.grammy,
    });
    this.artists.push(artist);
    return artist;
  }

  findAll() {
    return this.artists;
  }

  findOne(id: string) {
    const artist = this.artists.find((u) => u.id === id);
    if (!artist) {
      throw new NotFoundException(`Artist with id ${id} doesn't exist`);
    }
    return artist;
  }

  update(id: string, updateArtistDto: UpdateArtistDto) {
    const artistIndex = this.artists.findIndex((u) => u.id === id);

    if (artistIndex === -1) {
      throw new NotFoundException(`Artist with id ${id} doesn't exist`);
    }

    this.artists[artistIndex] = {
      ...this.artists[artistIndex],
      ...updateArtistDto,
    };
    return this.artists[artistIndex];
  }

  remove(id: string) {
    const artistIndex = this.artists.findIndex((u) => u.id === id);

    if (artistIndex === -1) {
      throw new NotFoundException(`Artist with id ${id} doesn't exist`);
    }

    if (this.favoritesService.favorites.artists.includes(id)) {
      this.favoritesService.removeArtist(id);
    }

    this.trackService.tracks.forEach((track) => {
      if (track.artistId === id) {
        track.artistId = null;
      }
    });
    this.albumService.albums.forEach((album) => {
      if (album.artistId === id) {
        album.artistId = null;
      }
    });

    this.artists.splice(artistIndex, 1);
    return `Artist with id ${id} was deleted`;
  }
}
