import { convertApartmentToDisplayString } from './apartment.utils';
import ApartmentBuilder from '_/test/builders/apartment.builder';

describe('convertApartmentToDisplayString', () => {
  test('should return correct display string', () => {
    // Arrange
    const apartment = new ApartmentBuilder()
      .withFloor('floor')
      .withLocation('location')
      .withRooms(42)
      .build();
    const expectedString = 'floor location (42 Zimmer)';

    // Act
    const displayString = convertApartmentToDisplayString(apartment);

    // Assert
    expect(displayString).toBe(expectedString);
  });
});
