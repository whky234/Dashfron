// src/pages/__tests__/About.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import About from "./about";
import "@testing-library/jest-dom";
import React, { JSX } from "react";

vi.mock("@mui/material", async () => {
    const actual: any = await vi.importActual("@mui/material");
    return {
        ...actual,
   Box: ({ children, component, ...props }: any) => {
      const Tag = component || "div";
      return <Tag {...props}>{children}</Tag>;
    },
           Typography: ({ children, variant, ...props }: any) => {
      const tagMap: Record<string, keyof JSX.IntrinsicElements> = {
        h1: "h1",
        h2: "h2",
        h3: "h3",
        h4: "h4",
        h5: "h5",
        h6: "h6",
        subtitle1: "h6",
        subtitle2: "h6",
        body1: "p",
        body2: "p",
      };
      const Tag = tagMap[variant] || "p";
      return <Tag {...props}>{children}</Tag>;
    },
    Button: ({ children, ...props }: any) => (
      <button {...props}>{children}</button>
    ),
    };
    });
vi.mock("@mui/icons-material", () => ({
    ArrowForward: () => <div>ArrowForwardIcon</div>,
}));
describe("About Component", () => {
  it("renders the heading", () => {
    render(<About />);
    expect(
      screen.getByRole("heading", { name: /About Our Store/i })
    ).toBeInTheDocument();
  });

  it("renders the about image", () => {
    render(<About />);
    const img = screen.getByAltText("About Us") as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toContain("unsplash");
  });

  it("renders the paragraph content", () => {
    render(<About />);
    expect(
      screen.getByText(/we are more than just a shopping site/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/our mission is to bring the best products/i)
    ).toBeInTheDocument();
  });

  it("renders the Shop Now button", () => {
    render(<About />);
    const button = screen.getByRole("button", { name: /shop now/i });
    expect(button).toBeInTheDocument();
  });
});
