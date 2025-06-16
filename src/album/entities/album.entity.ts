export class Album {
  id: string; // uuid v4
  name: string;
  year: number;
  artistId: string | null; // refers to Artist

  constructor({ id, name, year, artistId }) {
    this.id = id;
    this.name = name;
    this.year = year;
    this.artistId = artistId;
  }
}
