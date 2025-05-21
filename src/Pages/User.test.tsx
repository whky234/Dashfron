import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import User from "./User";
import React from "react";
import "@testing-library/jest-dom";

// Mocks
vi.mock("react-redux", async () => {
  const actual = await vi.importActual("react-redux");
  return {
    ...actual,
    useSelector: vi.fn().mockImplementation((selector) =>
      selector({
        auth: { user: { name: "Test User" } },
      })
    ),
  };
});

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    Outlet: () => <div data-testid="mock-outlet">Mocked Outlet</div>,
    Link: ({ to, children }: any) => <a href={to}>{children}</a>,
  };
});

// Manual reference to be able to control useMediaQuery between tests
let mockIsMobile = false;
vi.mock("@mui/material", async () => {
  const actual = await vi.importActual("@mui/material");
  return {
    ...actual,
    useMediaQuery: vi.fn(() => mockIsMobile),
  };
});

describe("User Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsMobile = false; // Reset to desktop by default
  });

  it("renders AppBar with nav links and user name on desktop", () => {
    render(<User />);
    expect(screen.getByText("User Panel")).toBeInTheDocument();
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("About")).toBeInTheDocument();
    expect(screen.getByText("Products")).toBeInTheDocument();
    expect(screen.getByText("Services")).toBeInTheDocument();
    expect(screen.getByText("Test User")).toBeInTheDocument();
    expect(screen.getByTestId("mock-outlet")).toBeInTheDocument();
  });

  it("renders menu button and opens drawer in mobile view", () => {
    // Set mobile mode BEFORE render
    mockIsMobile = true;
    render(<User />);

    const menuButton = screen.getByRole("button");
    expect(menuButton).toBeInTheDocument();

    fireEvent.click(menuButton);
    expect(screen.getByText("Menu")).toBeInTheDocument();
    expect(screen.getByText("Home")).toBeInTheDocument();
  });
});
