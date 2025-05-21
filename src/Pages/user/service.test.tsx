import { render, screen } from "@testing-library/react";
import Services from "./service";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as ThemeContext from "../../Context/usecontext";
import React from "react";
import "@testing-library/jest-dom";

// Mock MUI Icons (optional: makes snapshot cleaner and prevents unwanted side effects)
vi.mock("@mui/icons-material/LocalShipping", () => ({
  default: () => <div data-testid="icon-delivery" />,
}));
vi.mock("@mui/icons-material/SupportAgent", () => ({
  default: () => <div data-testid="icon-support" />,
}));
vi.mock("@mui/icons-material/Security", () => ({
  default: () => <div data-testid="icon-security" />,
}));
vi.mock("@mui/icons-material/Autorenew", () => ({
  default: () => <div data-testid="icon-return" />,
}));

vi.mock("mui/material", async () => {
    const actual = await vi.importActual<any>("@mui/material");
    return {
        ...actual,
        Box: (props: any) => <div {...props} />,
        Grid: (props: any) => <div {...props} />,
        Typography: (props: any) => <div {...props} />,
        Card: (props: any) => <div {...props} />,
        CardContent: (props: any) => <div {...props} />,
    };
    });

describe("Services Component", () => {
  const mockToggleTheme = vi.fn();

  beforeEach(() => {
    vi.spyOn(ThemeContext, "useThemeContext").mockReturnValue({
      theme: "light",
      toggletheme: mockToggleTheme,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders heading and all service cards", () => {
    render(<Services />);

    expect(screen.getByText("Our Services")).toBeInTheDocument();

    const titles = [
      "Fast Delivery",
      "24/7 Support",
      "Secure Payments",
      "Easy Returns",
    ];

    titles.forEach((title) => {
      expect(screen.getByText(title)).toBeInTheDocument();
    });

    expect(screen.getAllByText(/Get your products|Our support|Your payments|Return your product/)).toHaveLength(4);
  });

  it("applies light background when theme is light", () => {
    render(<Services />);
    const box = screen.getByText("Our Services").closest("div");
    expect(box).toHaveStyle("background-color: #fff");
  });

  it("applies dark background when theme is dark", () => {
    vi.spyOn(ThemeContext, "useThemeContext").mockReturnValue({
      theme: "dark",
      toggletheme: mockToggleTheme,
    });

    render(<Services />);
    const box = screen.getByText("Our Services").closest("div");
    expect(box).toHaveStyle("background-color: #333");
  });

  it("renders icons for all services", () => {
    render(<Services />);
    expect(screen.getByTestId("icon-delivery")).toBeInTheDocument();
    expect(screen.getByTestId("icon-support")).toBeInTheDocument();
    expect(screen.getByTestId("icon-security")).toBeInTheDocument();
    expect(screen.getByTestId("icon-return")).toBeInTheDocument();
  });
});
