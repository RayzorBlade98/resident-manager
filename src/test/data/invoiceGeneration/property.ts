import { invoiceEnd, invoiceStart } from './invoiceInformation';
import ParkingSpaceBuilder from '_/test/builders/parkingSpace.builder';
import PropertyBuilder from '_/test/builders/property.builder';

/**
 * Total costs: 40
 */
export const parkingSpace1 = new ParkingSpaceBuilder()
  .withId('space1')
  .addCosts({ date: invoiceEnd.addMonths(1), cost: 10000 })
  .addCosts({ date: invoiceEnd.addMonths(-1), cost: 15 })
  .addCosts({ date: invoiceStart.addMonths(-1), cost: 10 })
  .addCosts({ date: invoiceStart.addMonths(-2), cost: 10000 })
  .build();

/**
 * Total costs: 20
 */
export const parkingSpacePartial = new ParkingSpaceBuilder()
  .withId('spacePartial')
  .addCosts({ date: invoiceEnd, cost: 10000 })
  .addCosts({ date: invoiceEnd.addMonths(-1), cost: 20 })
  .addCosts({ date: invoiceStart, cost: 10000 })
  .build();

/**
 * Property for the invoice
 */
export const property = new PropertyBuilder()
  .withNumberOfApartments(4)
  .addParkingSpace(parkingSpace1)
  .addParkingSpace(parkingSpacePartial)
  .build();
