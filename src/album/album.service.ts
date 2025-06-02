import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';
import { FavoritesService } from 'src/favorites/favorites.service';
import { TrackService } from 'src/track/track.service';

@Injectable()
export class AlbumService {
  constructor(
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
    private readonly trackService: TrackService,
  ) {}

  albums: Album[] = [];

  create(createAlbumDto: CreateAlbumDto) {
    const album = new Album({
      id: crypto.randomUUID(),
      name: createAlbumDto.name,
      year: createAlbumDto.year,
      artistId: createAlbumDto.artistId,
    });
    this.albums.push(album);
    return album;
  }

  findAll() {
    return this.albums;
  }

  findOne(id: string) {
    const album = this.albums.find((u) => u.id === id);
    if (!album) {
      throw new NotFoundException(`Album with id ${id} doesn't exist`);
    }
    return album;
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto) {
    const albumIndex = this.albums.findIndex((u) => u.id === id);

    if (albumIndex === -1) {
      throw new NotFoundException(`Album with id ${id} doesn't exist`);
    }

    this.albums[albumIndex] = {
      ...this.albums[albumIndex],
      ...updateAlbumDto,
    };
    return this.albums[albumIndex];
  }

  remove(id: string) {
    const albumIndex = this.albums.findIndex((u) => u.id === id);

    if (albumIndex === -1) {
      throw new NotFoundException(`Album with id ${id} doesn't exist`);
    }

    if (this.favoritesService.favorites.albums.includes(id)) {
      this.favoritesService.removeAlbum(id);
    }

    this.trackService.tracks.forEach((track) => {
      if (track.albumId === id) {
        track.albumId = null;
      }
    });

    this.albums.splice(albumIndex, 1);

    return `Album with id ${id} was deleted`;
  }
}
