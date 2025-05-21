import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Whitetextfield from "./whiteTextfield"; // Update path as necessary
import "@testing-library/jest-dom";

// Mock @mui/material TextField
vi.mock("@mui/material", async () => {
  const actual = await vi.importActual("@mui/material");
  return {
    ...actual,
    TextField: ({ label, name, "data-testid": testId, onChange }: any) => (
      <input
        data-testid={testId}
        aria-label={label}
        name={name}
        onChange={onChange}
      />
    ),
  };
});


describe("Whitetextfield", () => {
  it("renders with label and name", () => {
    render(<Whitetextfield label="Username" name="username" />);
    const input = screen.getByTestId("textfield-username");
    expect(input).toBeInTheDocument();
  });

  it("generates testid from label if name is not provided", () => {
    render(<Whitetextfield label="Email Address" />);
    const input = screen.getByTestId("textfield-emailaddress");
    expect(input).toBeInTheDocument();
  });

  it("does not set data-testid if neither name nor label provided", () => {
    const { container } = render(<Whitetextfield />);
    const input = container.querySelector("input");
    expect(input?.getAttribute("data-testid")).toBe(null);
  });

  it("calls onChange handler", () => {
    const handleChange = vi.fn();
    render(<Whitetextfield label="Name" name="name" onChange={handleChange} />);
    const input = screen.getByTestId("textfield-name");
    fireEvent.change(input, { target: { value: "John" } });
    expect(handleChange).toHaveBeenCalled();
  });
});
