/* eslint-disable max-len */

import { RenderResult, fireEvent, render } from '@testing-library/react';
import React from 'react';
import GenericModal from '_/components/GenericComponents/GenericModal/GenericModal';
import RecoilTestWrapper from '_tests/__test_utils__/RecoillTestWrapper';

describe('GenericModal', () => {
  let renderResult: RenderResult;
  let onModalCloseCallback: jest.Mock;

  function setupRendering(
    show = true,
    includeContent = true,
  ): void {
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

  test('Should render modal if show is true', () => {
    // Assert
    const modal = renderResult.container.querySelector('.modal');
    expect(modal).toBeDefined();
  });

  test("Shouldn't render modal if show is false", () => {
    // Arrange
    setupRendering(false);

    // Assert
    const modal = renderResult.container.querySelector('.modal');
    expect(modal).toBeNull();
  });

  test('Should set right title', () => {
    // Arrange
    const modalTitleElement = renderResult.container.querySelector('.modal-title')!;

    // Assert
    expect(modalTitleElement.textContent).toBe('Test Title');
  });

  test('Should call onClose when clicking the exit button', () => {
    // Arrange
    const exitButton = renderResult.container.querySelector(
      '.modal-header button',
    )!;

    // Act
    fireEvent.click(exitButton);

    // Assert
    expect(onModalCloseCallback).toHaveBeenCalledTimes(1);
  });

  test('Should render content right', () => {
    // Arrange
    const modalBody = renderResult.container.querySelector(
      '.modal-body .test-body',
    );
    const modalFooter = renderResult.container.querySelector(
      '.modal-footer .test-footer',
    );

    // Assert
    expect(modalBody).toBeDefined();
    expect(modalFooter).toBeDefined();
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
});
