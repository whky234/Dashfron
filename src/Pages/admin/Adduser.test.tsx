import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, vi, beforeEach, afterEach, expect } from "vitest";
import AddUser from "./Adduser"; // Adjust the path as needed
import { MemoryRouter, Route, Routes } from "react-router-dom";
import React from "react";
import "@testing-library/jest-dom";

// Mock react-redux
const mockDispatch = vi.fn();
const mockSelector = vi.fn();



vi.mock("react-redux", async () => {
  const actual = await vi.importActual("react-redux");
  return {
    ...actual,
    useDispatch: () => mockDispatch,
    useSelector: (selector: unknown) => mockSelector(selector),
  };
});


// Mock hooks used in the component
vi.mock("../../hooks/Handlemessage", () => ({
  default: vi.fn(),
}));

vi.mock("../../hooks/whiteTextfield", () => ({
  default: ({ onChange, ...props }: any) => (
    <input data-testid="textfield" onChange={onChange} {...props} />
  ),
}));

// Helper render
const renderComponent = (path: string) => {
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/admin/users/:id" element={<AddUser setSnackBar={vi.fn()} />} />
        <Route path="/admin/users" element={<AddUser setSnackBar={vi.fn()} />} />
      </Routes>
    </MemoryRouter>
  );
};

describe("AddUser Component (mocked redux)", () => {
  beforeEach(() => {
    mockSelector.mockReturnValue({
      users: [
        {
          _id: "123",
          name: "Jane Doe",
          email: "jane@example.com",
          role: "admin",
          status: "active",
        },
      ],
      loading: false,
      message: null,
      error: null,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders Add New User correctly", () => {
    renderComponent("/admin/users");

    expect(screen.getByText("Add New User")).toBeInTheDocument();
    expect(screen.getByTestId("textfield-Name")).toBeInTheDocument();
    expect(screen.getByTestId("textfield-email")).toBeInTheDocument();
  });

  it("renders Edit User form with existing user data", () => {
    renderComponent("/admin/users/123");

    expect(screen.getByDisplayValue("Jane Doe")).toBeInTheDocument();
    expect(screen.getByDisplayValue("jane@example.com")).toBeInTheDocument();
    expect(screen.getByDisplayValue("admin")).toBeInTheDocument();
  });

  it("submits the form to add a user", async () => {
    renderComponent("/admin/users");

    fireEvent.change(screen.getByTestId("textfield-Name"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByTestId("textfield-email"), {
      target: { value: "john@example.com" },
    });

    fireEvent.submit(screen.getByRole("button", { name: /add user/i }));

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
    });
  });

  it("submits the form to update a user", async () => {
    renderComponent("/admin/users/123");

    fireEvent.change(screen.getByTestId("textfield-Name"), {
      target: { value: "Jane Smith" },
    });

    fireEvent.submit(screen.getByRole("button", { name: /update user/i }));

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
    });
  });
});
