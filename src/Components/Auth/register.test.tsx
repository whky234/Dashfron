import { describe, it, vi, beforeEach, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Register } from './Register';
import React from 'react';
import "@testing-library/jest-dom";

import userEvent from '@testing-library/user-event';
import { useSelector } from 'react-redux';

// Mocks
vi.mock('react-redux', async () => {
  const actual = await vi.importActual<typeof import('react-redux')>('react-redux');
  return {
    ...actual,
    useDispatch: () => vi.fn(() => Promise.resolve()),
    useSelector: vi.fn().mockImplementation((selectorFn) =>
      selectorFn({
        auth: {
          loading: false,
          error: null,
          message: null,
        },
      })
    ),
  };
});

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}));

vi.mock('../../stores/features/auththunk', () => ({
  register: vi.fn(() => Promise.resolve({})),
}));

vi.mock('../../hooks/Handlemessage', () => ({
  default: vi.fn(),
}));

vi.mock('@mui/material', async () => {
  const actual = await vi.importActual<typeof import('@mui/material')>('@mui/material');
  return {
    ...actual,
CircularProgress: () => <div role="progressbar">Loading...</div>,
  };
});

// Test case
describe('<Register />', () => {
  const mockSetSnackBar = vi.fn();

  beforeEach(() => {
    render(<Register setSnackBar={mockSetSnackBar} />);
  });

  it('renders the Register form', () => {
    expect(screen.getByText(/Please register your account/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Role/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Register/i })).toBeInTheDocument();
  });

  it('fills the form and submits', async() => {
     const user = userEvent.setup();

  // Fill Name
  await user.type(screen.getByLabelText(/Name/i), 'Hasnain');

  // Fill Email
  await user.type(screen.getByLabelText(/Email/i), 'hasnain@example.com');

  // Fill Password
  await user.type(screen.getByLabelText(/Password/i), 'password123');

  // Open the role select dropdown
  await user.click(screen.getByLabelText(/Role/i));

  // Click on the "Admin" option (it should be visible now)
  await user.click(screen.getByRole('option', { name: /Admin/i }));

  // Submit form
  await user.click(screen.getByRole('button', { name: /Register/i }));
  });

 it('shows loading spinner and disables the button when loading is true', () => {
  // Override useSelector mock to simulate loading
  (useSelector as vi.Mock).mockImplementation((selectorFn: any) =>
    selectorFn({
      auth: {
        loading: true,
        error: null,
        message: null,
      },
    })
  );

  render(<Register setSnackBar={mockSetSnackBar} />);

  // Check if spinner is shown
  expect(screen.getByRole('progressbar')).toBeInTheDocument();


});



});
