import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FavoritesService } from 'src/favorites/favorites.service';
import { TrackService } from 'src/track/track.service';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class AlbumService {
  constructor(
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
    private readonly trackService: TrackService,
    private prisma: DatabaseService,
  ) {}

  create(createAlbumDto: Prisma.AlbumCreateInput) {
    return this.prisma.album.create({
      data: createAlbumDto,
    });
  }

  findAll() {
    return this.prisma.album.findMany();
  }

  async findOne(id: string) {
    const album = await this.prisma.album.findUnique({
      where: {
        id: id,
      },
    });

    if (!album) {
      throw new NotFoundException(`Album with id ${id} doesn't exist`);
    }

    return album;
  }

  async update(id: string, updateAlbumDto: Prisma.AlbumUpdateInput) {
    const album = await this.prisma.album.findUnique({
      where: {
        id: id,
      },
    });

    if (!album) {
      throw new NotFoundException(`Album with id ${id} doesn't exist`);
    }

    return this.prisma.album.update({
      where: {
        id,
      },
      data: { ...updateAlbumDto },
    });
  }

  async remove(id: string) {
    const album = await this.prisma.album.findUnique({
      where: {
        id: id,
      },
    });

    if (!album) {
      throw new NotFoundException(`Album with id ${id} doesn't exist`);
    }
    await this.prisma.album.delete({ where: { id: id } });

    return `Album with id ${id} was deleted`;
  }
}
