import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FavoritesService } from 'src/favorites/favorites.service';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class TrackService {
  constructor(
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
    private prisma: DatabaseService,
  ) {}

  create(createTrackDto: Prisma.TrackCreateInput) {
    return this.prisma.track.create({
      data: createTrackDto,
    });
  }

  findAll() {
    return this.prisma.track.findMany();
  }

  async findOne(id: string) {
    const track = await this.prisma.track.findUnique({
      where: {
        id: id,
      },
    });

    if (!track) {
      throw new NotFoundException(`Track with id ${id} doesn't exist`);
    }

    return track;
  }

  async update(id: string, updateTrackDto: Prisma.TrackUpdateInput) {
    const track = await this.prisma.track.findUnique({
      where: {
        id: id,
      },
    });

    if (!track) {
      throw new NotFoundException(`Track with id ${id} doesn't exist`);
    }

    return this.prisma.track.update({
      where: {
        id,
      },
      data: { ...updateTrackDto },
    });
  }

  async remove(id: string) {
    const track = await this.prisma.track.findUnique({
      where: {
        id: id,
      },
    });

    if (!track) {
      throw new NotFoundException(`Track with id ${id} doesn't exist`);
    }
    await this.prisma.track.delete({ where: { id: id } });

    return `Track with id ${id} was deleted`;
  }
}
