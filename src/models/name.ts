/**
 * Object containing information about a name
 */
interface Name {
  /**
   * Salutation of the person
   */
  salutation: Salutation;

  /**
   * First name of the person
   */
  firstName: string;

  /**
   * Last name of the person
   */
  lastName: string;
}

/**
 * Enum containing all salutation types
 */
export enum Salutation {
  Male = 'Herr',
  Female = 'Frau',
}

export default Name;
