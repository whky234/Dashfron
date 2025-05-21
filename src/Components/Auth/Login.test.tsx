import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, vi, beforeEach, expect } from "vitest";
import { Login } from "./Login";
import userEvent from "@testing-library/user-event";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "@testing-library/jest-dom";

// Mocks
vi.mock("react-redux", () => ({
  useDispatch: vi.fn(),
  useSelector: vi.fn(),
}));

vi.mock("react-router-dom", () => ({
  useNavigate: vi.fn(),
}));

vi.mock("../../hooks/Handlemessage", () => ({
  default: vi.fn(),
}));

vi.mock("../../stores/features/auththunk", () => ({
  login: vi.fn((payload) => ({ type: "LOGIN", payload })),
}));

// Setup
const mockDispatch = vi.fn();
const mockNavigate = vi.fn();

beforeEach(() => {
  (useDispatch as unknown as vi.Mock).mockReturnValue(mockDispatch);
  (useNavigate as unknown as vi.Mock).mockReturnValue(mockNavigate);

  // Default selector values
  (useSelector as unknown as vi.Mock).mockImplementation((selectorFn) =>
    selectorFn({
      auth: {
        loading: false,
        error: null,
        message: null,
        user: null,
      },
    })
  );
});

describe("Login Component", () => {
  it("renders input fields and buttons", () => {
    render(<Login setSnackBar={vi.fn()} />);

    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Login/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Register/i })).toBeInTheDocument();
  });

  it("dispatches login on form submit", async () => {
    render(<Login setSnackBar={vi.fn()} />);
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const loginButton = screen.getByRole("button", { name: /Login/i });

    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "password123");

    fireEvent.click(loginButton);

    expect(mockDispatch).toHaveBeenCalled();
  });

  it("navigates to /user if user role is user", () => {
    (useSelector as vi.Mock).mockImplementation((selectorFn: (arg0: { auth: { loading: boolean; error: null; message: null; user: { role: string; }; }; }) => any) =>
      selectorFn({
        auth: {
          loading: false,
          error: null,
          message: null,
          user: { role: "user" },
        },
      })
    );

    render(<Login setSnackBar={vi.fn()} />);

    expect(mockNavigate).toHaveBeenCalledWith("/user");
  });

  it("navigates to /admin if user role is admin", () => {
    (useSelector as vi.Mock).mockImplementation((selectorFn: (arg0: { auth: { loading: boolean; error: null; message: null; user: { role: string; }; }; }) => any) =>
      selectorFn({
        auth: {
          loading: false,
          error: null,
          message: null,
          user: { role: "admin" },
        },
      })
    );

    render(<Login setSnackBar={vi.fn()} />);

    expect(mockNavigate).toHaveBeenCalledWith("/admin");
  });

  
  it("shows loading spinner when logging in", () => {
  (useSelector as vi.Mock).mockImplementation((selectorFn: any) =>
    selectorFn({
      auth: {
        loading: true,
        error: null,
        message: null,
        user: null,
      },
    })
  );

  render(<Login setSnackBar={vi.fn()} />);

  // Check that CircularProgress is rendered
  expect(screen.getByRole("progressbar")).toBeInTheDocument();
});

});
