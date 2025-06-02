import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Favorite } from './entities/favorite.entity';

import { ArtistService } from 'src/artist/artist.service';
import { AlbumService } from 'src/album/album.service';
import { TrackService } from 'src/track/track.service';

@Injectable()
export class FavoritesService {
  constructor(
    private readonly artistService: ArtistService,
    private readonly albumService: AlbumService,
    private readonly trackService: TrackService,
  ) {}

  favorites: Favorite = {
    artists: [],
    albums: [],
    tracks: [],
  };

  addTrack(id: string) {
    const track = this.trackService.findOne(id);
    if (!track) {
      throw new UnprocessableEntityException(
        `Track with id ${id} doesn't exist`,
      );
    }
    this.favorites.tracks.push(id);
    return `Track with id ${id} added to favorites`;
  }

  addAlbum(id: string) {
    const album = this.albumService.findOne(id);
    if (!album) {
      throw new UnprocessableEntityException(
        `Album with id ${id} doesn't exist`,
      );
    }
    this.favorites.albums.push(id);
    return `Album with id ${id} added to favorites`;
  }

  addArtist(id: string) {
    const artist = this.artistService.findOne(id);
    if (!artist) {
      throw new UnprocessableEntityException(
        `Artist with id ${id} doesn't exist`,
      );
    }
    this.favorites.artists.push(id);
    return `Artist with id ${id} added to favorites`;
  }

  findAll() {
    return {
      artists: this.favorites.artists.map((artistId) =>
        this.artistService.findOne(artistId),
      ),
      albums: this.favorites.albums.map((albumtId) =>
        this.albumService.findOne(albumtId),
      ),
      tracks: this.favorites.tracks.map((trackId) =>
        this.trackService.findOne(trackId),
      ),
    };
  }

  removeTrack(id: string) {
    const track = this.trackService.findOne(id);
    if (!track) {
      throw new UnprocessableEntityException(
        `Track with id ${id} doesn't exist`,
      );
    }
    if (!this.favorites.tracks.includes(id)) {
      throw new NotFoundException(`Track with id ${id} is not in favorites`);
    }
    this.favorites.tracks = this.favorites.tracks.filter(
      (trackId) => trackId !== id,
    );
    return `Track with id ${id} was removed from favorites`;
  }

  removeAlbum(id: string) {
    const album = this.albumService.findOne(id);
    if (!album) {
      throw new UnprocessableEntityException(
        `Album with id ${id} doesn't exist`,
      );
    }
    if (!this.favorites.albums.includes(id)) {
      throw new NotFoundException(`Album with id ${id} is not in favorites`);
    }
    this.favorites.albums = this.favorites.albums.filter(
      (albumId) => albumId !== id,
    );
    return `Album with id ${id} was removed from favorites`;
  }

  removeArtist(id: string) {
    const artist = this.artistService.findOne(id);
    if (!artist) {
      throw new UnprocessableEntityException(
        `Artist with id ${id} doesn't exist`,
      );
    }
    if (!this.favorites.artists.includes(id)) {
      throw new NotFoundException(`Artist with id ${id} is not in favorites`);
    }
    this.favorites.artists = this.favorites.artists.filter(
      (artistId) => artistId !== id,
    );
    return `Artist with id ${id} was removed from favorites`;
  }
}
