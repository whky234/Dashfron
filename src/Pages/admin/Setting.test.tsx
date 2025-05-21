import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useDispatch, useSelector } from "react-redux";
import Setting from "./settings";
import "@testing-library/jest-dom";


vi.mock("@mui/material", async () => {
  const actual: any = await vi.importActual("@mui/material");
  return {
    ...actual,
    Box: ({ children, ...props }: any) => <form {...props}>{children}</form>,
    Stack: ({ children }: any) => <div>{children}</div>,
    Button: ({ children, ...props }: any) => (
      <button {...props}>{children}</button>
    ),
    Typography: ({ children }: any) => <div>{children}</div>,
    Snackbar: ({ children }: any) => (
      <div data-testid="snackbar">{children}</div>
    ),
    Alert: ({ children }: any) => <div data-testid="alert">{children}</div>,
  };
});

const mockDispatch = vi.fn();
vi.mock("react-redux", async () => {
  const actual: any = await vi.importActual("react-redux");
  return {
    ...actual,
    useDispatch: () => mockDispatch,
    useSelector: vi.fn(),
  };
});

vi.mock("../../stores/store", () => ({
  AppDispatch: () => {},
  RootState: {},
}));

vi.mock("../../stores/features/auththunk", () => ({
  newpass: vi.fn(() => () => Promise.resolve({})),
}));

vi.mock("../../hooks/paper", () => ({
  default: ({ children }: any) => <div data-testid="paper">{children}</div>,
}));

vi.mock("../../hooks/whiteTextfield", () => ({
  default: ({ label, value, onChange, ...props }: any) => (
    <input
      data-testid={`textfield-${label.toLowerCase()}`}
      value={value}
      onChange={onChange}
      placeholder={label}
      {...props}
    />
  ),
}));

vi.mock("../../hooks/Handlemessage", () => ({
  default: vi.fn(),
}));

vi.mock("../../stores/features/authslice", () => ({
  clearMessages: vi.fn(),
}));

const mockUnwrap = vi.fn().mockResolvedValue({});
const mockThunk = vi.fn(() => ({ unwrap: mockUnwrap }));
vi.mock("../../stores/features/auththunk", () => ({
  newpass: vi.fn(() => mockThunk()),
}));

describe("Setting Component", () => {
  const setSnackBar = vi.fn();

  beforeEach(() => {
    mockDispatch.mockClear();
    mockThunk.mockClear();
    mockUnwrap.mockClear();

    (useSelector as vi.Mock).mockReturnValue({
      loading: false,
      error: null,
      message: null,
      user: { name: "Test User" },
    });
  });

  it("renders form fields and button", () => {
    render(<Setting setSnackBar={setSnackBar} />);

    expect(screen.getByPlaceholderText("Current Password")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("New Password")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Confirm New Password")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Update Password" })
    ).toBeInTheDocument();
  });

  it("shows warning snackbar if passwords don't match", async () => {
    render(<Setting setSnackBar={setSnackBar} />);

    fireEvent.change(screen.getByPlaceholderText("Current Password"), {
      target: { value: "oldpass" },
    });
    fireEvent.change(screen.getByPlaceholderText("New Password"), {
      target: { value: "newpass" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm New Password"), {
      target: { value: "wrongpass" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Update Password" }));

    await waitFor(() => {
      expect(screen.getByTestId("snackbar")).toBeInTheDocument();
      expect(screen.getByTestId("alert").textContent).toMatch(/do not match/i);
    });
  });

  it("dispatches newpass when passwords match", async () => {
    render(<Setting setSnackBar={setSnackBar} />);

    fireEvent.change(screen.getByPlaceholderText("Current Password"), {
      target: { value: "oldpass" },
    });
    fireEvent.change(screen.getByPlaceholderText("New Password"), {
      target: { value: "newpass" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm New Password"), {
      target: { value: "newpass" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Update Password" }));
    
  });
});
