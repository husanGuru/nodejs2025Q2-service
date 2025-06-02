import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';

@Injectable()
export class TrackService {
  tracks: Track[] = [];

  create(createTrackDto: CreateTrackDto) {
    const track = new Track({
      id: crypto.randomUUID(),
      name: createTrackDto.name,
      duration: createTrackDto.duration,
      albumId: createTrackDto.albumId,
      artistId: createTrackDto.artistId,
    });
    this.tracks.push(track);
    return track;
  }

  findAll() {
    return this.tracks;
  }

  findOne(id: string) {
    const track = this.tracks.find((u) => u.id === id);
    if (!track) {
      throw new NotFoundException(`Track with id ${id} doesn't exist`);
    }
    return track;
  }

  update(id: string, updateTrackDto: UpdateTrackDto) {
    const trackIndex = this.tracks.findIndex((u) => u.id === id);

    if (trackIndex === -1) {
      throw new NotFoundException(`Track with id ${id} doesn't exist`);
    }

    this.tracks[trackIndex] = {
      ...this.tracks[trackIndex],
      ...updateTrackDto,
    };
    return this.tracks[trackIndex];
  }

  remove(id: string) {
    const trackIndex = this.tracks.findIndex((u) => u.id === id);

    if (trackIndex === -1) {
      throw new NotFoundException(`Track with id ${id} doesn't exist`);
    }
    this.tracks.splice(trackIndex, 1);
    return `Track with id ${id} was deleted`;
  }
}
