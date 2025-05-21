// Admin.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Admin } from "./Admin";
import React from "react";
import "@testing-library/jest-dom";

// ✅ Mock react-router-dom's Outlet
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    Outlet: () => <div data-testid="mock-outlet">Mocked Outlet</div>,
  };
});

describe("Admin Layout", () => {
  it("renders layout with outlet", () => {
    render(<Admin />);
    // ✅ Check for layout container and mocked outlet
    expect(screen.getByTestId("mock-outlet")).toBeInTheDocument();
  });
});
