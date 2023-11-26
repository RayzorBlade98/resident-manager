import Prettify from './Prettify';

/**
 * Type that allows every property of `T` to be undefined
 */
type OptionallyDefined<T> = Prettify<{
  [K in keyof T]: T[K] | undefined;
}>;

export default OptionallyDefined;
