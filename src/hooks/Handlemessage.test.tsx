import { render, act } from '@testing-library/react';
import Handlemessages from './Handlemessage';
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PayloadAction } from '@reduxjs/toolkit';

// Mock clearMessageAction that returns a valid action
const mockClearMessageAction = vi.fn(() => ({ type: 'CLEAR_MESSAGE' }) as PayloadAction<undefined>);

// Create a dummy component to test the hook
const TestComponent = ({
  message,
  error,
  setSnackBar,
  dispatch,
}: {
  message?: string | null;
  error?: string | null;
  setSnackBar: React.Dispatch<React.SetStateAction<{ message: string; severity: 'success' | 'error' } | null>>;
  dispatch: any;
}) => {
  Handlemessages({
    message,
    error,
    clearMessageAction: mockClearMessageAction,
    setSnackBar,
    dispatch,
  });

  return <div>Test Hook Component</div>;
};

describe('Handlemessages Hook', () => {
  const setSnackBar = vi.fn();
  const dispatch = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('handles success message', async () => {
    await act(async () => {
      render(
        <TestComponent
          message="Product added successfully"
          error={null}
          setSnackBar={setSnackBar}
          dispatch={dispatch}
        />
      );
    });

    expect(setSnackBar).toHaveBeenCalledWith({ message: 'Product added successfully', severity: 'success' });
    expect(dispatch).toHaveBeenCalledWith({ type: 'CLEAR_MESSAGE' });
    expect(mockClearMessageAction).toHaveBeenCalled();
  });

  it('handles error message', async () => {
    await act(async () => {
      render(
        <TestComponent
          message={null}
          error="Something went wrong"
          setSnackBar={setSnackBar}
          dispatch={dispatch}
        />
      );
    });

    expect(setSnackBar).toHaveBeenCalledWith({ message: 'Something went wrong', severity: 'error' });
    expect(dispatch).toHaveBeenCalledWith({ type: 'CLEAR_MESSAGE' });
    expect(mockClearMessageAction).toHaveBeenCalled();
  });

  it('does nothing if no message or error', async () => {
    await act(async () => {
      render(
        <TestComponent
          message={null}
          error={null}
          setSnackBar={setSnackBar}
          dispatch={dispatch}
        />
      );
    });

    expect(setSnackBar).not.toHaveBeenCalled();
    expect(dispatch).not.toHaveBeenCalled();
    expect(mockClearMessageAction).not.toHaveBeenCalled();
  });
});
