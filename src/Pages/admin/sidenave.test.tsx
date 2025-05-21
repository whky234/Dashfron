import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import SideNav from "./sidenave"; // Update path as necessary
import "@testing-library/jest-dom";

// Mocks for react-router-dom
let mockedPathname = "/admin/analytics";
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useLocation: () => ({
      pathname: mockedPathname,
    }),
    Link: ({ to, children }: any) => <a href={to}>{children}</a>,
  };
});

// Mocks for @mui/icons-material
vi.mock("@mui/icons-material", () => ({
  People: () => <span data-testid="icon-people" />,
  BarChart: () => <span data-testid="icon-bar" />,
  Settings: () => <span data-testid="icon-settings" />,
  Close: () => <span data-testid="icon-close" />,
  ExpandLess: () => <span data-testid="icon-expand-less">[-]</span>,
  ExpandMore: () => <span data-testid="icon-expand-more">[+]</span>,
  PersonAdd: () => <span data-testid="icon-add-user" />,
  Group: () => <span data-testid="icon-all-users" />,
  Person: () => <span data-testid="icon-person" />,
}));

// Mocks for @mui/material
vi.mock("@mui/material", async () => {
  const actual = await vi.importActual("@mui/material");
  return {
    ...actual,
    Drawer: ({ open, children }: any) => open ? <div data-testid="drawer">{children}</div> : null,
    IconButton: ({ onClick, children }: any) => (
      <button onClick={onClick} data-testid="icon-button">
        {children}
      </button>
    ),
    List: ({ children }: any) => <ul data-testid="list">{children}</ul>,
  ListItem: ({ children, onClick, sx, ...props }: any) => {
  const testId = sx?.backgroundColor === "#077A7D" ? "active-item" : undefined;
  return (
    <li onClick={onClick} data-testid={testId} {...props}>
      {children}
    </li>
  );
},
    ListItemIcon: ({ children }: any) => <span>{children}</span>,
    ListItemText: ({ primary }: any) => <span>{primary}</span>,
    Collapse: ({ in: open, children }: any) =>
      open ? <div data-testid="collapse">{children}</div> : null,
    Divider: () => <hr />,
    Box: ({ children }: any) => <div>{children}</div>,
    useMediaQuery: () => false,
  };
});


describe("SideNav", () => {
  const defaultProps = {
    open: true,
    onClose: vi.fn(),
    variant: "temporary" as const,
  };

  beforeEach(() => {
    defaultProps.onClose.mockClear();
    mockedPathname = "/admin/analytics";
  });

  it("renders drawer and main links", () => {
    render(<SideNav {...defaultProps} />);
    expect(screen.getByTestId("drawer")).toBeInTheDocument();
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("User Management")).toBeInTheDocument();
    expect(screen.getByText("Product")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    render(<SideNav {...defaultProps} />);
    const closeBtn = screen.getByTestId("icon-button");
    fireEvent.click(closeBtn);
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it("toggles User Management menu", () => {
    render(<SideNav {...defaultProps} />);
    const userMgmtToggle = screen.getByText("User Management");
    fireEvent.click(userMgmtToggle);
    expect(screen.getByTestId("collapse")).toBeInTheDocument();
    expect(screen.getByText("All Users")).toBeInTheDocument();
    expect(screen.getByText("Add User")).toBeInTheDocument();
  });

  it("highlights active link", () => {
    mockedPathname = "/admin/settings";
    render(<SideNav {...defaultProps} />);
   expect(screen.getByTestId("active-item")).toBeInTheDocument();
expect(screen.getByTestId("active-item")).toHaveTextContent("Settings");
  });

  it("does not render drawer when open is false", () => {
    render(<SideNav {...defaultProps} open={false} />);
    expect(screen.queryByTestId("drawer")).not.toBeInTheDocument();
  });
});
