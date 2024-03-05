import { v4 as uuid } from 'uuid';
import Apartment from '_/models/property/apartment';

class ApartmentBuilder {
  private apartment: Apartment;

  constructor() {
    this.apartment = {
      id: uuid(),
      floor: 'EG',
      location: 'left',
      rooms: {
        generic: 3,
        kitchen: 1,
        bath: 2,
        basement: 1,
        hallway: 2,
        garden: 0,
      },
    };
  }

  public withFloor(floor: string): ApartmentBuilder {
    this.apartment.floor = floor;
    return this;
  }

  public withLocation(location: string): ApartmentBuilder {
    this.apartment.location = location;
    return this;
  }

  public withRooms(rooms: Partial<Apartment['rooms']>): ApartmentBuilder {
    this.apartment.rooms = { ...this.apartment.rooms, ...rooms };
    return this;
  }

  public withId(id: string): ApartmentBuilder {
    this.apartment.id = id;
    return this;
  }

  public build(): Apartment {
    return this.apartment;
  }
}

export default ApartmentBuilder;
