import Prettify from './Prettify';

/**
 * Type that replaces all date types with the string type
 * representing the result of the import of an object from type `T`
 */
type Imported<T extends object> = Prettify<{
  [key in keyof T]: T[key] extends Date | undefined
    ? string
    : T[key] extends object
      ? Imported<T[key]>
      : T[key];
}>;

export default Imported;
