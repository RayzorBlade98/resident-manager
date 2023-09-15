import { renderHook } from '@testing-library/react';
import { range } from 'lodash';
import { act } from 'react-dom/test-utils';
import { RecoilRoot } from 'recoil';
import useResidentState from './useResidentState';
import residentState from '_/states/resident/resident.state';
import ResidentBuilder from '_/test/builders/resident.builder';
import useInitializedRecoilState from '_/test/hooks/useInitializedRecoilState';

describe('useResidentState', () => {
  const residents = range(0, 3).map((_) => new ResidentBuilder().build());

  describe('residents', () => {
    test('should return right residents', () => {
      // Arrange
      const { result } = renderHook(
        () => useInitializedRecoilState({
          state: residentState,
          stateValue: residents,
          hook: useResidentState,
        }),
        {
          wrapper: RecoilRoot,
        },
      );

      // Assert
      expect(result.current.residents).toEqual(residents);
    });
  });

  describe('addResident', () => {
    test('should set state correctly', () => {
      // Arrange
      const { result } = renderHook(useResidentState, {
        wrapper: RecoilRoot,
      });

      // Act
      act(() => {
        residents.forEach(result.current.addResident);
      });

      // Assert
      expect(result.current.residents).toEqual(residents);
    });
  });
});
