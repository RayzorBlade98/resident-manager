/* eslint-disable max-len */

import { Box } from '@mui/material';
import {
  RenderResult,
  cleanup,
  fireEvent,
  render,
} from '@testing-library/react';
import { generateImage } from 'jsdom-screenshot';
import React from 'react';
import GenericModal from '_/components/generic/GenericModal/GenericModal';
import ReactTestWrapper from '_/test/ReactTestWrapper';

describe('GenericModal', () => {
  let renderResult: RenderResult;
  let onModalCloseCallback: jest.Mock;

  function setupRendering(show = true, includeContent = true): void {
    onModalCloseCallback = jest.fn();
    renderResult = render(
      <ReactTestWrapper>
        <GenericModal
          show={show}
          onClose={onModalCloseCallback}
          title="Test Title"
        >
          {includeContent && (
            <Box
              sx={{ height: '200px', width: '200px', backgroundColor: 'grey' }}
              className="test-body"
            />
          )}
          {includeContent && (
            <Box
              sx={{ height: '50px', width: '100%', backgroundColor: 'black' }}
              className="test-footer"
            />
          )}
        </GenericModal>
      </ReactTestWrapper>,
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

  test('should match iamge snapshot', async () => {
    // Assert
    expect(
      await generateImage({ viewport: { width: 400, height: 400 } }),
    ).toMatchImageSnapshot();
  });
});
