import { RenderResult, fireEvent, render } from '@testing-library/react';
import React from 'react';
import DialogTitleWithCloseButton from './DialogTitleWithCloseButton';

describe('DialogTitleWithCloseButton', () => {
  let onCloseMock: jest.Mock;
  let renderResult: RenderResult;

  beforeAll(() => {
    onCloseMock = jest.fn();
    renderResult = render(<DialogTitleWithCloseButton onClose={onCloseMock} />);
  });

  test('should call onClose when clicking the close button', () => {
    // Act
    const button = renderResult.getByRole('button')!;
    fireEvent.click(button);

    // Assert
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });
});
