declare interface Date {
  /**
   * Converts the date to a new date in UTC timezone
   */
  toUTC(): Date;

  /**
   * Converts the date to 'DD.MM.YYYY' format string
   */
  toPreferredString(): string;
}

function toUTC(this: Date): Date {
  return new Date(
    Date.UTC(this.getFullYear(), this.getMonth(), this.getDate(), 0, 0, 0, 0),
  );
}
Date.prototype.toUTC = toUTC;

function toPreferredString(this: Date): string {
  const day: number = this.getDate();
  const month: number = this.getMonth() + 1;
  const year = String(this.getFullYear());

  const dayPrefix: string = day < 10 ? '0' : '';
  const monthPrefix: string = month < 10 ? '0' : '';

  return `${dayPrefix}${String(day)}.${monthPrefix}${String(month)}.${year}`;
}
Date.prototype.toPreferredString = toPreferredString;
