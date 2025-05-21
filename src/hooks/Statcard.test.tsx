import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import StatCard from "./Statcard"; // Update path as necessary
import "@testing-library/jest-dom";
// Mock MUI components
vi.mock("@mui/material", async () => {
  const actual = await vi.importActual("@mui/material");
  return {
    ...actual,
    Box: ({ children }: any) => <div data-testid="mui-box">{children}</div>,
    Typography: ({ children, ...props }: any) => (
      <div data-testid="mui-typography" {...props}>
        {children}
      </div>
    ),
    Avatar: ({ children, ...props }: any) => (
      <div data-testid="mui-avatar" {...props}>
        {children}
      </div>
    ),
  };
});

// Mock MUI icons
vi.mock("@mui/icons-material", () => ({
  ArrowDropUp: (props: any) => <span data-testid="arrow-up" {...props}>↑</span>,
  ArrowDropDown: (props: any) => <span data-testid="arrow-down" {...props}>↓</span>,
}));

// Mock react-countup
vi.mock("react-countup", async () => {
  const actual = await vi.importActual("react-countup");
  return {
    ...actual,
    default: ({ end, prefix = "", suffix = "" }: any) => (
      <span data-testid="countup">
        {prefix}
        {end}
        {suffix}
      </span>
    ),
  };
});







// Mock PaperWrapper
vi.mock("./paper", () => ({
  __esModule: true,
  default: ({ children }: any) => <div data-testid="paper-wrapper">{children}</div>,
}));


describe("StatCard", () => {
  it("renders label, value, and icon", () => {
    render(
      <StatCard
        label="Users"
        value={1234}
        icon={<span>👤</span>}
        color="blue"
      />
    );

    expect(screen.getByText("USERS")).toBeInTheDocument();
    expect(screen.getByTestId("countup")).toHaveTextContent("1234");
    expect(screen.getByText("👤")).toBeInTheDocument();
  });

  it("renders prefix and suffix", () => {
    render(
      <StatCard
        label="Revenue"
        value={5000}
        icon={<span>$</span>}
        color="green"
        prefix="$"
        suffix=" USD"
      />
    );

    expect(screen.getByTestId("countup")).toHaveTextContent("$5000 USD");
  });

  it("renders positive diff with arrow up", () => {
    render(
      <StatCard
        label="Growth"
        value={75}
        icon={<span>📈</span>}
        color="purple"
        diff={10}
      />
    );

    expect(screen.getByTestId("arrow-up")).toBeInTheDocument();
    expect(screen.getByText("10%")).toBeInTheDocument();
    expect(screen.getByText("Since last month")).toBeInTheDocument();
  });

  it("renders negative diff with arrow down", () => {
    render(
      <StatCard
        label="Drop"
        value={30}
        icon={<span>📉</span>}
        color="red"
        diff={-20}
      />
    );

    expect(screen.getByTestId("arrow-down")).toBeInTheDocument();
    expect(screen.getByText("20%")).toBeInTheDocument();
    expect(screen.getByText("Since last month")).toBeInTheDocument();
  });
});
