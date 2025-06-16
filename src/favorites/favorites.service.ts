import {
  Injectable,
  NotFoundException,
  OnModuleInit,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Favorite } from './entities/favorite.entity';

import { ArtistService } from 'src/artist/artist.service';
import { AlbumService } from 'src/album/album.service';
import { TrackService } from 'src/track/track.service';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class FavoritesService implements OnModuleInit {
  constructor(
    private readonly artistService: ArtistService,
    private readonly albumService: AlbumService,
    private readonly trackService: TrackService,
    private prisma: DatabaseService,
  ) {}

  async onModuleInit() {
    const favorite = await this.prisma.favorite.findFirst();

    if (!favorite) {
      await this.prisma.favorite.create({
        data: {},
      });
      console.log(`Favorite row created for user`);
    } else {
      console.log(`Favorite row already exists`);
    }
  }

  favorites: Favorite = {
    artists: [],
    albums: [],
    tracks: [],
  };

  async addTrack(id: string) {
    const track = await this.prisma.track.findUnique({ where: { id: id } });
    if (!track) {
      throw new UnprocessableEntityException(
        `Track with id ${id} doesn't exist`,
      );
    }
    await this.prisma.favorite.update({
      where: { id: 1 },
      data: {
        tracks: {
          connect: [{ id: id }],
        },
      },
    });
    return `Track with id ${id} added to favorites`;
  }

  async addAlbum(id: string) {
    const album = await this.prisma.album.findUnique({ where: { id: id } });
    if (!album) {
      throw new UnprocessableEntityException(
        `Album with id ${id} doesn't exist`,
      );
    }
    await this.prisma.favorite.update({
      where: { id: 1 },
      data: {
        albums: {
          connect: [{ id: id }],
        },
      },
    });
    return `Album with id ${id} added to favorites`;
  }

  async addArtist(id: string) {
    const artist = await this.prisma.artist.findUnique({ where: { id: id } });
    if (!artist) {
      throw new UnprocessableEntityException(
        `Artist with id ${id} doesn't exist`,
      );
    }
    await this.prisma.favorite.update({
      where: { id: 1 },
      data: {
        artists: {
          connect: [{ id: id }],
        },
      },
    });
    return `Artist with id ${id} added to favorites`;
  }

  findAll() {
    return this.prisma.favorite.findFirst({
      select: {
        artists: {
          select: {
            id: true,
            name: true,
            grammy: true,
          },
        },
        albums: {
          select: {
            id: true,
            name: true,
            year: true,
            artistId: true,
          },
        },
        tracks: {
          select: {
            id: true,
            name: true,
            duration: true,
            albumId: true,
            artistId: true,
          },
        },
      },
    });
  }

  async removeTrack(id: string) {
    const track = await this.prisma.track.findUnique({ where: { id: id } });
    if (!track) {
      throw new UnprocessableEntityException(
        `Track with id ${id} doesn't exist`,
      );
    }
    const favorite = await this.prisma.favorite.findFirst({
      include: { tracks: true },
    });

    if (!favorite.tracks.find((track) => track.id === id)) {
      throw new NotFoundException(`Track with id ${id} is not in favorites`);
    }
    await this.prisma.favorite.update({
      where: { id: 1 },
      data: {
        tracks: {
          disconnect: [{ id: id }],
        },
      },
    });
    return `Track with id ${id} was removed from favorites`;
  }

  async removeAlbum(id: string) {
    const album = await this.prisma.album.findUnique({ where: { id: id } });
    if (!album) {
      throw new UnprocessableEntityException(
        `Album with id ${id} doesn't exist`,
      );
    }
    const favorite = await this.prisma.favorite.findFirst({
      include: { albums: true },
    });

    if (!favorite.albums.find((album) => album.id === id)) {
      throw new NotFoundException(`Album with id ${id} is not in favorites`);
    }
    await this.prisma.favorite.update({
      where: { id: 1 },
      data: {
        albums: {
          disconnect: [{ id: id }],
        },
      },
    });
    return `Album with id ${id} was removed from favorites`;
  }

  async removeArtist(id: string) {
    const artist = await this.prisma.artist.findUnique({ where: { id: id } });
    if (!artist) {
      throw new UnprocessableEntityException(
        `Artist with id ${id} doesn't exist`,
      );
    }
    const favorite = await this.prisma.favorite.findFirst({
      include: { artists: true },
    });

    if (!favorite.artists.find((artist) => artist.id === id)) {
      throw new NotFoundException(`Artist with id ${id} is not in favorites`);
    }
    await this.prisma.favorite.update({
      where: { id: 1 },
      data: {
        artists: {
          disconnect: [{ id: id }],
        },
      },
    });
    return `Artist with id ${id} was removed from favorites`;
  }
}
