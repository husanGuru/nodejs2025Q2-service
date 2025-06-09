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
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ArtistService {
  constructor(
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
    private readonly trackService: TrackService,
    private readonly albumService: AlbumService,
    private prisma: DatabaseService,
  ) {}

  create(createArtistDto: Prisma.ArtistCreateInput) {
    return this.prisma.artist.create({
      data: createArtistDto,
    });
  }

  findAll() {
    return this.prisma.artist.findMany();
  }

  async findOne(id: string) {
    const artist = await this.prisma.artist.findUnique({
      where: {
        id: id,
      },
    });

    if (!artist) {
      throw new NotFoundException(`Artist with id ${id} doesn't exist`);
    }

    return artist;
  }

  async update(id: string, updateArtistDto: Prisma.ArtistUpdateInput) {
    const artist = await this.prisma.artist.findUnique({
      where: {
        id: id,
      },
    });

    if (!artist) {
      throw new NotFoundException(`Artist with id ${id} doesn't exist`);
    }

    return this.prisma.artist.update({
      where: {
        id,
      },
      data: { ...updateArtistDto },
    });
  }

  async remove(id: string) {
    const artist = await this.prisma.artist.findUnique({
      where: {
        id: id,
      },
    });

    if (!artist) {
      throw new NotFoundException(`Album with id ${id} doesn't exist`);
    }
    await this.prisma.artist.delete({ where: { id: id } });

    return `Album with id ${id} was deleted`;
  }
}
