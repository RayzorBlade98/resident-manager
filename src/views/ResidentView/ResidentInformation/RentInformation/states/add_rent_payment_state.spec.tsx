/* eslint-disable react-hooks/exhaustive-deps, react/jsx-no-useless-fragment */

import { act, render } from '@testing-library/react';
import React, { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { getRecoil, resetRecoil, setRecoil } from 'recoil-nexus';
import addRentPaymentState, {
  addRentPaymentFormErrorSelector,
  addRentPaymentFormInputSelector,
} from './add_rent_payment_state';
import RecoilTestWrapper from '_tests/__test_utils__/RecoillTestWrapper';

describe('add_rent_payment_state', () => {
  const stateValues = {
    formInput: {
      paymentAmount: 12345,
      paymentDate: new Date(2023, 4, 28),
    },
    formErrors: {
      paymentAmount: 'Wrong paymentAmount',
      paymentDate: 'Wrong paymentDate',
    },
  };

  beforeEach(() => {
    render(<RecoilTestWrapper />);

    act(() => {
      setRecoil(addRentPaymentState, (state) => ({
        ...state,
        ...stateValues,
      }));
    });
  });

  afterEach(() => {
    act(() => {
      resetRecoil(addRentPaymentState);
    });
  });

  describe('addRentPaymentFormErrorSelector', () => {
    test('should return right values', () => {
      // Act
      const formErrors = getRecoil(addRentPaymentFormErrorSelector);

      // Assert
      expect(formErrors).toEqual(stateValues.formErrors);
    });
  });

  describe('addRentPaymentFormInputSelector', () => {
    test('should return right values', () => {
      // Act
      const formInput = getRecoil(addRentPaymentFormInputSelector);

      // Assert
      expect(formInput).toEqual(stateValues.formInput);
    });

    test('should set the state to right values', () => {
      const newInputs = {
        paymentAmount: 54321,
        paymentDate: new Date(1998, 11, 25),
      };

      function TestComponent(): JSX.Element {
        const setFormInput = useSetRecoilState(addRentPaymentFormInputSelector);
        useEffect(() => {
          setFormInput(newInputs);
        }, []);
        return <></>;
      }

      // Act
      render(
        <RecoilTestWrapper>
          <TestComponent />
        </RecoilTestWrapper>,
      );

      // Assert
      const newState = getRecoil(addRentPaymentState);
      expect(newState.formInput).toEqual(newInputs);
      expect(newState.formErrors).toEqual({});
    });
  });
});
