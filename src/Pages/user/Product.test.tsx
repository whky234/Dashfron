import { render, screen } from "@testing-library/react";
import Product from "./Products";
import { useDispatch, useSelector } from "react-redux";
import { fetchproduct } from "../../stores/features/productslice";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import React from "react";
import "@testing-library/jest-dom";

// Mock MUI CircularProgress and components to avoid unnecessary complexity
vi.mock("@mui/material", async () => {
  const actual = await vi.importActual<any>("@mui/material");
  return {
    ...actual,
    CircularProgress: (props: any) => <div data-testid="loader">Loading...</div>,
  };
});

vi.mock("mui/material", async () => {   
    const actual = await vi.importActual<any>("@mui/material");
    return {
        ...actual,
        Box: (props: any) => <div {...props} />,
        Card: (props: any) => <div {...props} />,
        CardContent: (props: any) => <div {...props} />,
        CardMedia: (props: any) => <img {...props} />,
        Typography: (props: any) => <div {...props} />,
        Grid: (props: any) => <div {...props} />,
    };
    });

// Mock Redux hooks and fetchproduct
vi.mock("react-redux", () => ({
  useDispatch: vi.fn(),
  useSelector: vi.fn(),
}));

vi.mock("../../stores/features/productslice", () => ({
  fetchproduct: vi.fn(),
}));

describe("Product Component", () => {
  const mockDispatch = vi.fn();

  beforeEach(() => {
    (useDispatch as vi.Mock).mockReturnValue(mockDispatch);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("shows loader when loading is true", () => {
    (useSelector as vi.Mock).mockImplementation((cb) =>
      cb({
        product: {
          products: [],
          loading: true,
          error: null,
        },
      })
    );

    render(<Product />);
    expect(screen.getByTestId("loader")).toBeInTheDocument();
  });

  it("shows error message when error is present", () => {
    (useSelector as vi.Mock).mockImplementation((cb) =>
      cb({
        product: {
          products: [],
          loading: false,
          error: "Something went wrong!",
        },
      })
    );

    render(<Product />);
    expect(screen.getByText("Something went wrong!")).toBeInTheDocument();
  });

  it("renders products when data is loaded", () => {
    const mockProducts = [
      {
        _id: "1",
        name: "Gold Ring",
        image: "ring.jpg",
        price: 199.99,
      },
      {
        _id: "2",
        name: "Silver Necklace",
        image: "necklace.jpg",
        price: 99.99,
      },
    ];

    (useSelector as vi.Mock).mockImplementation((cb) =>
      cb({
        product: {
          products: mockProducts,
          loading: false,
          error: null,
        },
      })
    );

    render(<Product />);

    expect(screen.getByText("Gold Ring")).toBeInTheDocument();
    expect(screen.getByText("Silver Necklace")).toBeInTheDocument();
    expect(screen.getAllByText(/Add to cart/i)).toHaveLength(2);
    expect(screen.getByText("$199.99")).toBeInTheDocument();
    expect(screen.getByText("$99.99")).toBeInTheDocument();
  });

  it("dispatches fetchproduct on mount", () => {
    (useSelector as vi.Mock).mockImplementation((cb) =>
      cb({
        product: {
          products: [],
          loading: false,
          error: null,
        },
      })
    );

    render(<Product />);
    expect(mockDispatch).toHaveBeenCalled();
    expect(fetchproduct).toHaveBeenCalled();
  });
});
