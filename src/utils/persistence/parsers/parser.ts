/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Basic parser for types that don't need any special parsing
 */
abstract class StandardParser {
  /**
   * Handles the parsing of a value that correspons to a specific key
   * @param key key of the parsed value
   * @param value value that should be parsed
   * @returns parsed value
   */
  public static reviver(this: void, key: string, value: any): any {
    return value;
  }
}

export default StandardParser;
