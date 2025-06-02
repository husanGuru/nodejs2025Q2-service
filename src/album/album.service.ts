import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';

@Injectable()
export class AlbumService {
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
    this.albums.splice(albumIndex, 1);
    return `Album with id ${id} was deleted`;
  }
}
