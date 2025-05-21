/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent } from '@testing-library/react';
import ConfirmDialog from './confimation';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import React from 'react';


// Optional: Mock @mui/material components if needed
vi.mock('@mui/material', async () => {
  const actual = await vi.importActual('@mui/material');
  return {
    ...actual,
    Dialog: ({ open, children }: any) => open ? <div>{children}</div> : null,
    DialogTitle: ({ children }: any) => <h2>{children}</h2>,
    DialogContent: ({ children }: any) => <div>{children}</div>,
    DialogContentText: ({ children }: any) => <p>{children}</p>,
    DialogActions: ({ children }: any) => <div>{children}</div>,
    Button: ({ children, onClick, disabled }: any) => (
      <button onClick={onClick} disabled={disabled}>{children}</button>
    ),
  };
});

describe('ConfirmDialog', () => {
  it('renders dialog with title and message', () => {
    render(
      <ConfirmDialog
        open={true}
        title="Delete Item"
        message="Are you sure you want to delete this?"
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    );

    expect(screen.getByText('Delete Item')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to delete this?')).toBeInTheDocument();
    expect(screen.getByText('Confirm')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('calls onConfirm and onCancel correctly', () => {
    const handleConfirm = vi.fn();
    const handleCancel = vi.fn();

    render(
      <ConfirmDialog
        open={true}
        title="Delete"
        message="Confirm?"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    );

    fireEvent.click(screen.getByText('Cancel'));
    expect(handleCancel).toHaveBeenCalled();

    fireEvent.click(screen.getByText('Confirm'));
    expect(handleConfirm).toHaveBeenCalled();
  });

  it('disables buttons when loading is true', () => {
    render(
      <ConfirmDialog
        open={true}
        title="Delete"
        message="Confirm?"
        onConfirm={() => {}}
        onCancel={() => {}}
        loading={true}
      />
    );

    expect(screen.getByText('Confirm')).toBeDisabled();
    expect(screen.getByText('Cancel')).toBeDisabled();
  });
});
