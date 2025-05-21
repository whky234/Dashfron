import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, vi, beforeEach, expect } from 'vitest';
import UserManagement from './usermanagement';
import * as reactRedux from 'react-redux';
import React from 'react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
const mockNavigate = vi.fn();

vi.mock('react-redux', async () => {
  const actual = await vi.importActual('react-redux');
  return {
    ...actual,
    useDispatch: vi.fn(),
    useSelector: vi.fn(),
  };
});

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../../hooks/Handlemessage', () => ({
  default: vi.fn(),
}));

vi.mock('../../stores/features/usermangement', () => ({
  Fetchuser: vi.fn(() => ({ type: 'FETCH_USER' })),
  Deleteuser: vi.fn(() => ({ type: 'DELETE_USER' })),
  ChangeStatus: vi.fn(() => ({ type: 'CHANGE_STATUS' })),
  ChangeRole: vi.fn(() => ({ type: 'CHANGE_ROLE' })),
  clearMessages: vi.fn(() => ({ type: 'CLEAR_MESSAGES' })),
}));

vi.mock('../../hooks/reuseabletable', () => ({
  default: ({ title }: { title: string }) => <div>{title}</div>,
}));

vi.mock("../../hooks/confimation", () => ({
  default: ({ open, onConfirm, onCancel }: any) =>
    open ? (
      <div data-testid="confirm-dialog">
        <button onClick={onConfirm}>Confirm</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    ) : null,
}));

vi.mock("@mui/icons-material/Edit", () => ({
  default: () => <svg data-testid="EditIcon" />,
}));

vi.mock("@mui/icons-material/Delete", () => ({
  default: () => <svg data-testid="DeleteIcon" />,
}));

// Mock reusable table
vi.mock("../../hooks/reuseabletable", () => ({
  default: (props: any) => (
    <div>
      <div>Reusable Table - {props.title}</div>
      {props.rows?.map((row: any) => (
        <div key={row._id} data-testid="product-row">
          {row.name}
          {props.actions?.map((action: any, idx: number) => (
            <button key={idx} onClick={() => action.onClick(row)}>
              {action.label}
            </button>
          ))}
        </div>
      ))}
      <input
        data-testid="search-input"
        value={props.searchTerm}
        onChange={(e) => props.setSearchTerm?.(e.target.value)}
      />
    </div>
  ),
}));

describe('UserManagement Component', () => {
  const mockDispatch = vi.fn();

  beforeEach(() => {
    vi.spyOn(reactRedux, 'useDispatch').mockReturnValue(mockDispatch);
    vi.spyOn(reactRedux, 'useSelector').mockImplementation((selector) =>
      selector({
        userManagement: {
          users: [
            {
              _id: 'user1',
              name: 'John Doe',
              email: 'john@example.com',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              status: 'active',
              role: 'user',
            },
          ],
          message: null,
          error: null,
        },
      })
    );
  });

  it('renders without crashing', () => {
    const setSnackBar = vi.fn();
    render(<UserManagement setSnackBar={setSnackBar} />);
    expect(screen.getByText(/User Management/i)).toBeInTheDocument();
  });

  it('dispatches Fetchuser on mount', () => {
    const setSnackBar = vi.fn();
    render(<UserManagement setSnackBar={setSnackBar} />);
    expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'FETCH_USER' }));
  });

   
   it("handles edit and delete actions", async () => {
        const setSnackBar = vi.fn();

    render(<UserManagement setSnackBar={setSnackBar} />);

    const editButtons = screen.getAllByText("Edit");
    const deleteButtons = screen.getAllByText("Delete");

    await userEvent.click(editButtons[0]);
    expect(mockNavigate).toHaveBeenCalledWith("/admin/users/edit/user1");

    await userEvent.click(deleteButtons[0]);
    expect(screen.getByTestId("confirm-dialog")).toBeInTheDocument();

    mockDispatch.mockResolvedValueOnce({});
    await userEvent.click(screen.getByText("Confirm"));

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
    });
  });

  it("handles cancel delete", async () => {
        const setSnackBar = vi.fn();

    render(<UserManagement setSnackBar={setSnackBar} />);

    const deleteButtons = screen.getAllByText("Delete");
    await userEvent.click(deleteButtons[0]);

    expect(screen.getByTestId("confirm-dialog")).toBeInTheDocument();

    await userEvent.click(screen.getByText("Cancel"));
    expect(screen.queryByTestId("confirm-dialog")).not.toBeInTheDocument();
  });


});



