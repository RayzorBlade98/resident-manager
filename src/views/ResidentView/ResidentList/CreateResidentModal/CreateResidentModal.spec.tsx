import { act, render } from '@testing-library/react';
import { generateImage } from 'jsdom-screenshot';
import React from 'react';
import { setRecoil } from 'recoil-nexus';
import createResidentState from '../states/create_resident_state';
import CreateResidentModal from './CreateResidentModal';
import MonthYear from '_/extensions/date/month_year.extension';
import ReactTestWrapper from '_/test/ReactTestWrapper';

describe('CreateResidentModal', () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2023, 4, 31));
  });

  test('should match snapshot', async () => {
    // Arrange
    render(
      <ReactTestWrapper>
        <CreateResidentModal />
      </ReactTestWrapper>,
    );
    act(() => {
      setRecoil(createResidentState, (state) => ({
        ...state,
        showModal: true,
        formValidation: {
          ...state.formValidation,
          formInput: {
            ...state.formValidation.formInput,
            contractStart: new MonthYear(5, 2023),
          },
        },
      }));
    });

    // Assert
    expect(
      await generateImage({ viewport: { width: 650, height: 400 } }),
    ).toMatchImageSnapshot();
  });
});
