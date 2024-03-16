import { v4 as uuid } from 'uuid';
import ParkingSpace from '_/models/property/parkingSpace';

class ParkingSpaceBuilder {
  private parkingSpace: ParkingSpace;

  constructor() {
    this.parkingSpace = {
      id: uuid(),
      name: 'parking space 1',
      costs: [],
    };
  }

  public withName(name: string): ParkingSpaceBuilder {
    this.parkingSpace.name = name;
    return this;
  }

  public withId(id: string): ParkingSpaceBuilder {
    this.parkingSpace.id = id;
    return this;
  }

  public addCosts(costs: ParkingSpace['costs'][number]): ParkingSpaceBuilder {
    this.parkingSpace.costs.push(costs);
    return this;
  }

  public build(): ParkingSpace {
    return this.parkingSpace;
  }
}

export default ParkingSpaceBuilder;
