import WaterMeterReading from '_/models/resident/water_meter_reading';

class WaterMeterReadingBuilder {
  private waterMeterReading: WaterMeterReading;

  constructor() {
    this.waterMeterReading = {
      readingDate: new Date(2023, 5, 13),
      waterMeterCount: 1337,
    };
  }

  public withReadingDate(date: Date): WaterMeterReadingBuilder {
    this.waterMeterReading.readingDate = date;
    return this;
  }

  public withWaterMeterCount(count: number): WaterMeterReadingBuilder {
    this.waterMeterReading.waterMeterCount = count;
    return this;
  }

  public build(): WaterMeterReading {
    return this.waterMeterReading;
  }
}

export default WaterMeterReadingBuilder;
