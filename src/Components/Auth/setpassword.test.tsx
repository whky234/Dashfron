import { describe, it, vi, beforeEach, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SetPassword from './setpassword';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

// Mocks
const mockDispatch = vi.fn();
const mockNavigate = vi.fn();
const mockSetSnackBar = vi.fn();
let mockSearchParams = new URLSearchParams({ token: 'dummy-token' });

vi.mock('react-redux', async () => {
const actual = await vi.importActual<typeof import('react-redux')>('react-redux');
return {
...actual,
useDispatch: () => mockDispatch,
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
useSearchParams: () => [mockSearchParams],
useNavigate: () => mockNavigate,
}));

vi.mock('../../stores/features/auththunk', () => ({
setNewPassword: vi.fn(({ token, password }) => ({
type: 'setNewPassword',
payload: { token, password },
})),
}));

vi.mock('../../hooks/Handlemessage', () => ({
default: vi.fn(),
}));

// Component Test
describe('<SetPassword />', () => {
beforeEach(() => {
render(<SetPassword setSnackBar={mockSetSnackBar} />);
mockDispatch.mockClear();
mockNavigate.mockClear();
mockSetSnackBar.mockClear();
});

it('renders input fields and button', () => {
    expect(screen.getByTestId('new-password')).toBeInTheDocument();
    expect(screen.getByTestId('confirm-password')).toBeInTheDocument();
expect(screen.getByRole('button', { name: /Set Password/i })).toBeInTheDocument();
});

it('shows error if passwords do not match', async () => {
const user = userEvent.setup();
    await user.type(screen.getByTestId('new-password'), 'Pass123!');
    await user.type(screen.getByTestId('confirm-password'), 'Mismatch!');
await user.click(screen.getByRole('button', { name: /Set Password/i }));


await waitFor(() =>
  expect(mockSetSnackBar).toHaveBeenCalledWith({
    message: 'Passwords do not match.',
    severity: 'error',
  })
);
});

it('dispatches setNewPassword and navigates on success', async () => {
const user = userEvent.setup();
    await user.type(screen.getByTestId('new-password'), 'AnyPass123!');
    await user.type(screen.getByTestId('confirm-password'), 'AnyPass123!');
await user.click(screen.getByRole('button', { name: /Set Password/i }));


await waitFor(() =>
  expect(mockDispatch).toHaveBeenCalledWith({
  type: 'setNewPassword',
  payload: { token: 'dummy-token', password: 'AnyPass123!' },
})

);

expect(mockNavigate).toHaveBeenCalledWith('/login');
});



it('shows error if token is missing', async () => {
// simulate missing token by reassigning mockSearchParams before rendering
mockSearchParams = new URLSearchParams();


render(<SetPassword setSnackBar={mockSetSnackBar} />);

const user = userEvent.setup();
  await user.type(screen.getAllByTestId('new-password')[0], 'AnyPass123!');
await user.type(screen.getAllByTestId('confirm-password')[0], 'AnyPass123!');

await user.click(screen.getAllByRole('button')[0]);

await waitFor(() =>
  expect(mockSetSnackBar).toHaveBeenCalledWith({
    message: 'Token is missing or invalid.',
    severity: 'error',
  })
);
});




});