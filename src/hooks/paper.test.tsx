import React from "react";
import { render, screen } from "@testing-library/react";
import PaperWrapper from "./paper";
import { describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom";

// ✅ Mock @mui/material's Paper
vi.mock("@mui/material", async () => {
  const actual = await vi.importActual("@mui/material");
  return {
    ...actual,
    Paper: ({ children, sx, ...props }: any) => (
      <div data-testid="mock-paper" data-sx={JSON.stringify(sx)} {...props}>
        {children}
      </div>
    ),
  };
});

describe("PaperWrapper", () => {
  it("renders children and applies custom styles", () => {
    render(
      <PaperWrapper sx={{ padding: "20px" }}>
        <span>Hello World</span>
      </PaperWrapper>
    );

    const paper = screen.getByTestId("mock-paper");

    expect(paper).toBeInTheDocument();
    expect(paper).toContainHTML("<span>Hello World</span>");

    const sx = JSON.parse(paper.getAttribute("data-sx") || "{}");
    expect(sx).toMatchObject({
      backgroundColor: "#222831",
      color: "#EEEEEE",
      padding: "20px",
    });
  });
});
