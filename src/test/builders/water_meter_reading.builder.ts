import WaterMeterReading from '_/models/resident/water_meter_reading';
import '_/extensions/date/date.extension';

class WaterMeterReadingBuilder {
  private waterMeterReading: WaterMeterReading;

  constructor() {
    this.waterMeterReading = {
      readingDate: new Date(2023, 5, 13).toUTC(),
      waterMeterCount: 1337,
    };
  }

  public withReadingDate(date: Date): WaterMeterReadingBuilder {
    this.waterMeterReading.readingDate = date.toUTC();
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
