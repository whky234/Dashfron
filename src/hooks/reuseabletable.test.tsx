import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { describe, it, vi, expect, beforeEach } from "vitest";
import ReusableTable from "./reuseabletable";
import "@testing-library/jest-dom";

// Mock MUI components
vi.mock("@mui/material", async () => {
  const actual = await vi.importActual("@mui/material");
  return {
    ...actual,
    Typography: ({ children }: any) => <div>{children}</div>,
    Button: ({ children, onClick }: any) => <button onClick={onClick}>{children}</button>,
    Table: ({ children }: any) => <table>{children}</table>,
    TableBody: ({ children }: any) => <tbody>{children}</tbody>,
    TableCell: ({ children }: any) => <td>{children}</td>,
    TableContainer: ({ children }: any) => <div>{children}</div>,
    TableHead: ({ children }: any) => <thead>{children}</thead>,
    TableRow: ({ children }: any) => <tr>{children}</tr>,
    TablePagination: () => <div>Pagination</div>,
    IconButton: ({ onClick, children }: any) => <button onClick={onClick}>{children}</button>,
    Menu: ({ children }: any) => <div>{children}</div>,
    MenuItem: ({ children, onClick }: any) => <div onClick={onClick}>{children}</div>,
    Tooltip: ({ children }: any) => <div>{children}</div>,
    Divider: () => <hr />,
    Box: ({ children }: any) => <div>{children}</div>,
    InputAdornment: ({ children }: any) => <div>{children}</div>,
    TextField: ({ children, onChange }: any) => (
      <input data-testid="text-field" onChange={onChange} />
    ),

  };
});

// Mock react-router-dom
vi.mock("react-router-dom", () => ({
  Link: ({ children }: any) => <a>{children}</a>,
  RouterLink: ({ children }: any) => <a>{children}</a>,
}));

// Mock custom components
vi.mock("./paper", () => ({
  default: ({ children }: any) => <div data-testid="paper-wrapper">{children}</div>,
}));
vi.mock("./whiteTextfield", () => ({
  default: ({ onChange }: any) => <input data-testid="search-input" onChange={onChange} />,
}));

describe("ReusableTable", () => {
  const mockColumns = [
    { label: "Name", field: "name" },
    { label: "Age", field: "age" },
  ];

  const mockRows = [
    { _id: "1", name: "Alice", age: 25 },
    { _id: "2", name: "Bob", age: 30 },
  ];

  const mockActions = [
    {
      icon: <span>🗑️</span>,
      label: "Delete",
      onClick: vi.fn(),
    },
  ];

  it("renders title and rows", () => {
    render(
      <ReusableTable
        title="Test Table"
        columns={mockColumns}
        rows={mockRows}
        actions={[]}
      />
    );
    expect(screen.getByText("Test Table")).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
  });

  it("renders action buttons", () => {
    render(
      <ReusableTable
        columns={mockColumns}
        rows={mockRows}
        actions={mockActions}
      />
    );
    expect(screen.getAllByText("🗑️")).toHaveLength(2);
  });

  it("calls action on click", () => {
    render(
      <ReusableTable
        columns={mockColumns}
        rows={mockRows}
        actions={mockActions}
      />
    );
    const actionButton = screen.getAllByText("🗑️")[0];
    fireEvent.click(actionButton);
    expect(mockActions[0].onClick).toHaveBeenCalled();
  });

  it("shows no data message if no rows", () => {
    render(<ReusableTable columns={mockColumns} rows={[]} />);
    expect(screen.getByText("No data available.")).toBeInTheDocument();
  });

  it("renders pagination when enabled", () => {
    render(
      <ReusableTable
        columns={mockColumns}
        rows={mockRows}
        page={0}
        rowsPerPage={5}
        totalCount={10}
        onPageChange={() => {}}
        onRowsPerPageChange={() => {}}
      />
    );
    expect(screen.getByText("Pagination")).toBeInTheDocument();
  });

  it("renders and updates search input", () => {
  const mockSetSearchTerm = vi.fn();
  render(
    <ReusableTable
      columns={mockColumns}
      rows={mockRows}
      searchTerm="Alice"
      setSearchTerm={mockSetSearchTerm}
    />
  );

  const input = screen.getByTestId("search-input");
  fireEvent.change(input, { target: { value: "Bob" } });
  expect(mockSetSearchTerm).toHaveBeenCalledWith("Bob");
});


it("renders add button when addLink is provided", () => {
  render(
    <ReusableTable
      columns={mockColumns}
      rows={mockRows}
      addLink="/add"
      addButtonLabel="Add New"
      addButtonIcon={<span>➕</span>}
    />
  );
  expect(screen.getByText("Add New")).toBeInTheDocument();
});



  

 
});
