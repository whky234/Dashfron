// src/pages/__tests__/Homes.test.tsx

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Homes from "./Home";
import { BrowserRouter } from "react-router-dom";
import React from "react";
import "@testing-library/jest-dom";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<any>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("mui/material", async () => {
  const actual = await vi.importActual<any>("@mui/material");
  return {
    ...actual,
    Box: (props: any) => <div {...props} />,
    Typography: (props: any) => <div {...props} />,
    Button: (props: any) => <button {...props} />,
    Grid: (props: any) => <div {...props} />,
    Card: (props: any) => <div {...props} />,
    CardMedia: (props: any) => <img {...props} />,
    CardContent: (props: any) => <div {...props} />,
  };
});

describe("Homes Component", () => {
  it("renders hero section with heading and description", () => {
    render(
      <BrowserRouter>
        <Homes />
      </BrowserRouter>
    );

    expect(
      screen.getByText(/A Million Sparkles for Just One You/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Discover elegance in every detail/i)
    ).toBeInTheDocument();
  });

  it('renders "Shop Now" button', () => {
    render(
      <BrowserRouter>
        <Homes />
      </BrowserRouter>
    );

    const shopNowBtn = screen.getByRole("button", { name: /shop now/i });
    expect(shopNowBtn).toBeInTheDocument();
  });

  it("renders all featured products", () => {
    render(
      <BrowserRouter>
        <Homes />
      </BrowserRouter>
    );

    expect(screen.getByText(/Featured Products/i)).toBeInTheDocument();

    expect(screen.getByText(/Diamond Ring/i)).toBeInTheDocument();
expect(screen.getAllByText(/\$2400/i)).toHaveLength(3);

    expect(screen.getByText(/Luxury Earrings/i)).toBeInTheDocument();
    expect(screen.getByText(/Gold Bracelet/i)).toBeInTheDocument();
  });

  it("renders 'View Product' buttons for each product", () => {
    render(
      <BrowserRouter>
        <Homes />
      </BrowserRouter>
    );

    const viewButtons = screen.getAllByRole("button", { name: /view product/i });
    expect(viewButtons).toHaveLength(3);
  });

  it("navigates when buttons are clicked", () => {
 

    render(
      <BrowserRouter>
        <Homes />
      </BrowserRouter>
    );

    const shopNowBtn = screen.getByRole("button", { name: /shop now/i });
    fireEvent.click(shopNowBtn);
    expect(mockNavigate).toHaveBeenCalledWith("/products");

    const viewButtons = screen.getAllByRole("button", { name: /view product/i });
    fireEvent.click(viewButtons[0]);
    expect(mockNavigate).toHaveBeenCalledWith("users/products");
  });
});
