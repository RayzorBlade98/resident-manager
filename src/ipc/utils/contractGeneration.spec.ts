import { generateContractMarkdown } from './contractGeneration';

jest.mock('../../assets/contract/contractTemplate.md', () => 'test');

describe('generateContractMarkdown', () => {
  test('should return right markdown string', () => {
    // Act
    const contract = generateContractMarkdown();

    // Assert
    expect(contract).toBe('test');
  });
});
