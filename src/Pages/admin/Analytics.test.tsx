import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, vi, beforeEach, afterEach, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Analytics from "./analytics";
import React from "react";
import "@testing-library/jest-dom";


// Mock Redux
const mockDispatch = vi.fn();
const mockSelector = vi.fn();

vi.mock("react-redux", async () => {
  const actual = await vi.importActual("react-redux");
  return {
    ...actual,
    useDispatch: () => mockDispatch,
    useSelector: (selector: unknown) => mockSelector(selector),
  };
});

// Mock navigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock MUI useMediaQuery
vi.mock("@mui/material/useMediaQuery", () => ({
  __esModule: true,
  default: () => false, // not mobile
}));

// Mock Chart components
vi.mock("recharts", async () => {
  const actual = await vi.importActual("recharts");
  return {
    ...actual,
    ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
    PieChart: ({ children }: any) => <div>{children}</div>,
    Pie: ({ children }: any) => <div>{children}</div>,
    Cell: () => <div />,
    Tooltip: () => <div />,
    Legend: () => <div />,
  };
});

// Mocks for custom components
vi.mock("../../hooks/Statcard", () => ({
  __esModule: true,
  default: ({ label, value }: any) => (
    <div data-testid={`stat-${label}`}>{label}: {value}</div>
  ),
}));

vi.mock("../../hooks/reuseabletable", () => ({
  __esModule: true,
  default: ({ rows }: any) => (
    <div data-testid="table">
      {rows.map((r: any, i: number) => (
        <div key={i}>{r.name}</div>
      ))}
    </div>
  ),
}));

vi.mock("../../hooks/paper", () => ({
  __esModule: true,
  default: ({ children }: any) => <div>{children}</div>,
}));

vi.mock("./userchart", () => ({
  __esModule: true,
  default: () => <div data-testid="user-chart">User Chart</div>,
}));

// Sample mock data
const usersMock = [
  {
    _id: "1",
    name: "Alice",
    email: "alice@example.com",
    status: "active",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "2",
    name: "Bob",
    email: "bob@example.com",
    status: "pending",
    createdAt: new Date().toISOString(),
  },
];

const productsMock = [
  {
    _id: "p1",
    name: "Product 1",
    updatedAt: new Date().toISOString(),
    price: 100,
    category: "Electronics",
  },
  {
    _id: "p2",
    name: "Product 2",
    updatedAt: new Date().toISOString(),
    price: 150,
    category: "Books",
  },
];

describe("Analytics Component", () => {
  beforeEach(() => {
    mockDispatch.mockClear();
    mockNavigate.mockClear();
    mockSelector.mockImplementation((selectorFn: any) =>
      selectorFn({
        userManagement: { users: usersMock },
        product: { products: productsMock },
      })
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders stats cards", () => {
    render(
      <MemoryRouter>
        <Analytics />
      </MemoryRouter>
    );

    expect(screen.getByTestId("stat-Total Products")).toBeInTheDocument();
    expect(screen.getByTestId("stat-Inventory Value")).toBeInTheDocument();
    expect(screen.getByTestId("stat-Active Users")).toBeInTheDocument();
    expect(screen.getByTestId("stat-Pending Users")).toBeInTheDocument();
  });

  it("renders user chart", () => {
    render(
      <MemoryRouter>
        <Analytics />
      </MemoryRouter>
    );
    expect(screen.getByTestId("user-chart")).toBeInTheDocument();
  });

  it("renders latest users", () => {
    render(
      <MemoryRouter>
        <Analytics />
      </MemoryRouter>
    );

    expect(screen.getByText("Latest Users")).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
  });

  it("renders latest products table", () => {
    render(
      <MemoryRouter>
        <Analytics />
      </MemoryRouter>
    );

    expect(screen.getByTestId("table")).toBeInTheDocument();
    expect(screen.getByText("Product 1")).toBeInTheDocument();
    expect(screen.getByText("Product 2")).toBeInTheDocument();
  });

  it("navigates to users page when 'See more' is clicked", async () => {
    render(
      <MemoryRouter>
        <Analytics />
      </MemoryRouter>
    );

    const seeMoreButtons = screen.getAllByRole("button");
    seeMoreButtons[0].click(); // Click first "See more" (users)

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/admin/users");
    });
  });

  it("navigates to products page when second 'See more' is clicked", async () => {
    render(
      <MemoryRouter>
        <Analytics />
      </MemoryRouter>
    );

    const seeMoreButtons = screen.getAllByRole("button");
    seeMoreButtons[1].click(); // Click second "See more" (products)

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/admin/products");
    });
  });
});
