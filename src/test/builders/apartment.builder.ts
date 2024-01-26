import { v4 as uuid } from 'uuid';
import Apartment from '_/models/property/apartment';

class ApartmentBuilder {
  private apartment: Apartment;

  constructor() {
    this.apartment = {
      id: uuid(),
      floor: 'EG',
      location: 'left',
      rooms: 3,
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

  public withRooms(rooms: number): ApartmentBuilder {
    this.apartment.rooms = rooms;
    return this;
  }

  public build(): Apartment {
    return this.apartment;
  }
}

export default ApartmentBuilder;
