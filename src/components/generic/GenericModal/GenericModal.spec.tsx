/* eslint-disable max-len */

import {
  RenderResult,
  cleanup,
  fireEvent,
  render,
} from '@testing-library/react';
import React from 'react';
import GenericModal from '_/components/generic/GenericModal/GenericModal';
import RecoilTestWrapper from '_tests/__test_utils__/RecoillTestWrapper';

describe('GenericModal', () => {
  let renderResult: RenderResult;
  let onModalCloseCallback: jest.Mock;

  function setupRendering(show = true, includeContent = true): void {
    onModalCloseCallback = jest.fn();
    renderResult = render(
      <RecoilTestWrapper>
        <GenericModal
          show={show}
          onClose={onModalCloseCallback}
          title="Test Title"
        >
          {includeContent && <div className="test-body" />}
          {includeContent && <div className="test-footer" />}
        </GenericModal>
      </RecoilTestWrapper>,
    );
  }

  beforeEach(() => {
    setupRendering();
  });

  test('Should call onClose when clicking the exit button', () => {
    // Act
    const exitButton = renderResult.getByRole('button');
    fireEvent.click(exitButton);

    // Assert
    expect(onModalCloseCallback).toHaveBeenCalledTimes(1);
  });

  test('Should throw error if no children are provided', () => {
    // Act
    let error = false;
    try {
      setupRendering(true, false);
    } catch (e) {
      error = true;
    }

    // Assert
    expect(error).toBeTruthy();
  });

  test('should not render closed modal', () => {
    // Arrange
    cleanup();
    setupRendering(false);

    // Assert
    const modal = renderResult.queryByRole('dialog');
    expect(modal).toBeNull();
  });

  test('should match snapshot', () => {
    // Assert
    expect(renderResult.baseElement).toMatchSnapshot();
  });
});
