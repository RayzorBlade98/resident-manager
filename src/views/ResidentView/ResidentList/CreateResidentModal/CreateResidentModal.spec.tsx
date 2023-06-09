import { act, render } from '@testing-library/react';
import React from 'react';
import { setRecoil } from 'recoil-nexus';
import createResidentState from '../states/create_resident_state';
import CreateResidentModal from './CreateResidentModal';
import ReactTestWrapper from '_/test/ReactTestWrapper';

describe('CreateResidentModal', () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2023, 4, 31));
  });

  test('should match snapshot', () => {
    // Arrange
    const renderResult = render(
      <ReactTestWrapper>
        <CreateResidentModal />
      </ReactTestWrapper>,
    );
    act(() => {
      setRecoil(createResidentState, (state) => ({
        ...state,
        showModal: true,
      }));
    });

    // Assert
    expect(renderResult.baseElement).toMatchSnapshot();
  });
});
