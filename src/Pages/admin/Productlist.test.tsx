/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AdminProductList from "./Productlist";
import '@testing-library/jest-dom';

// Create mocks outside the describe so we can reference them in the vi.mock
const mockDispatch = vi.fn();
const mockNavigate = vi.fn();
const mockSetSnackBar = vi.fn();

// Mock react-redux
vi.mock("react-redux", async () => {
  const actual = await vi.importActual("react-redux");
  return {
    ...actual,
    useDispatch: () => mockDispatch,
    useSelector: (selectorFn: any) =>
      selectorFn({
        product: {
          products: [
            {
              _id: "1",
              name: "Product 1",
              category: "Category 1",
              createBy: { name: "Admin" },
              image: "image1.jpg",
              price: 10,
              stock: 100,
              updatedAt: new Date().toISOString(),
            },
            {
              _id: "2",
              name: "Product 2",
              category: "Category 2",
              createBy: { name: "User" },
              image: "image2.jpg",
              price: 20,
              stock: 50,
              updatedAt: new Date().toISOString(),
            },
          ],
          error: null,
          message: null,
        },
      }),
  };
});

// Mock react-router-dom
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock MUI Box to avoid layout issues
vi.mock("@mui/material", async () => {
  const actual = await vi.importActual("@mui/material");
  return {
    ...actual,
    Box: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  };
});

vi.mock("@mui/icons-material/Edit", () => ({
  default: () => <svg data-testid="EditIcon" />,
}));

vi.mock("@mui/icons-material/Delete", () => ({
  default: () => <svg data-testid="DeleteIcon" />,
}));

// Mock product actions
vi.mock("../../stores/features/productslice", () => ({
  fetchproduct: vi.fn(() => ({ type: "fetchproduct" })),
  delproduct: vi.fn(() => ({ type: "delproduct" })),
  clearMessages: vi.fn(() => ({ type: "clearMessages" })),
}));

// Mock handlemessage hook
vi.mock("../../hooks/Handlemessage", () => ({
  __esModule: true,
  default: vi.fn(),
}));

vi.mock("../../hooks/confimation", () => ({
  default: ({ open, onConfirm, onCancel }: any) =>
    open ? (
      <div data-testid="confirm-dialog">
        <button onClick={onConfirm}>Confirm</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    ) : null,
}));
// Mock PaperWrapper and WhiteTextField components
vi.mock("../../hooks/paper", () => ({  
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("../../hooks/whiteTextfield", () => ({
  __esModule: true,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  default: ({ children, ...props }: any) => (
    <input {...props} data-testid="white-text-field" />
  ),
}));



// Mock reusable table
vi.mock("../../hooks/reuseabletable", () => ({
  default: (props: any) => (
    <div>
      <div>Reusable Table - {props.title}</div>
      {props.rows?.map((row: any) => (
        <div key={row._id} data-testid="product-row">
          {row.name}
          {props.actions?.map((action: any, idx: number) => (
            <button key={idx} onClick={() => action.onClick(row)}>
              {action.label}
            </button>
          ))}
        </div>
      ))}
      <input
        data-testid="search-input"
        value={props.searchTerm}
        onChange={(e) => props.setSearchTerm?.(e.target.value)}
      />
    </div>
  ),
}));

describe("AdminProductList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders product list and handles search", async () => {
render(
  
    <AdminProductList setSnackBar={mockSetSnackBar} />
 
);
    expect(screen.getByText("Reusable Table - Products List")).toBeInTheDocument();
    expect(screen.getAllByTestId("product-row")).toHaveLength(2);

    const searchInput = screen.getByTestId("search-input");
    await userEvent.type(searchInput, "Product 1");
    expect(searchInput).toHaveValue("Product 1");

    await waitFor(() => {
      expect(screen.getAllByTestId("product-row")).toHaveLength(1);
    });
  });

  it("handles edit and delete actions", async () => {
    render(<AdminProductList setSnackBar={mockSetSnackBar} />);

    const editButtons = screen.getAllByText("Edit");
    const deleteButtons = screen.getAllByText("Delete");

    await userEvent.click(editButtons[0]);
    expect(mockNavigate).toHaveBeenCalledWith("/admin/products/edit/1");

    await userEvent.click(deleteButtons[0]);
    expect(screen.getByTestId("confirm-dialog")).toBeInTheDocument();

    mockDispatch.mockResolvedValueOnce({});
    await userEvent.click(screen.getByText("Confirm"));

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
    });
  });

  it("handles cancel delete", async () => {
    render(<AdminProductList setSnackBar={mockSetSnackBar} />);

    const deleteButtons = screen.getAllByText("Delete");
    await userEvent.click(deleteButtons[0]);

    expect(screen.getByTestId("confirm-dialog")).toBeInTheDocument();

    await userEvent.click(screen.getByText("Cancel"));
    expect(screen.queryByTestId("confirm-dialog")).not.toBeInTheDocument();
  });
});
