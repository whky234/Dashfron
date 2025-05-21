/* eslint-disable @typescript-eslint/no-explicit-any */
// src/Pages/admin/header.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import Header from "./header";
import React from "react";
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';

const mockNavigate = vi.fn();

// Mock third-party modules
vi.mock("react-redux", async () => {
  const actual = await vi.importActual("react-redux");
  return {
    ...actual,
    useDispatch: () => vi.fn(),
    useSelector: vi.fn().mockImplementation((selector: any) =>
      selector({
        auth: { user: { name: "Test User", email: "test@example.com" } },
        profile: { profile: { profilePicture: "avatar.jpg" } },
      })
    ),
  };
});

// ✅ Correct static mocking of useNavigate
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("@mui/material", async () => {
  const actual = await vi.importActual("@mui/material");
  return {
    ...actual,
    useMediaQuery: () => false,
  };
});


vi.mock("@mui/icons-material", () => ({
  Menu: () => <div>MenuIcon</div>,
  Settings: () => <div>SettingsIcon</div>,
  Person: () => <div>PersonIcon</div>,
  Logout: () => <div>LogoutIcon</div>,
}));

vi.mock("@mui/material/Menu", () => ({
    __esModule: true,
    default: ({ children, anchorEl, open, onClose }: any) => (
        <div>
        {open && <div role="menu">{children}</div>}
        <button onClick={onClose}>Close</button>
        </div>
    ),
    }));

vi.mock("@mui/material/MenuItem", () => ({
    __esModule: true,
    default: ({ children, onClick }: any) => (
        <div role="menuitem" onClick={onClick}>
        {children}
        </div>
    ),
    }));

vi.mock("@mui/material/ListItemIcon", () => ({
    __esModule: true,
    default: ({ children }: any) => <div>{children}</div>,
}));
vi.mock("@mui/material/Divider", () => ({
    __esModule: true,
    default: () => <div>Divider</div>,
}));
vi.mock("@mui/material/Avatar", () => ({
  __esModule: true,
  default: ({ src, alt, onClick }: any) => (
    <img src={src} alt={alt} onClick={onClick} />
  ),
}));

vi.mock("@mui/material/Box", () => ({
  __esModule: true,
  default: ({ children }: any) => <div>{children}</div>,
}));



describe("Header component", () => {
  const onMenuClickMock = vi.fn();

  it("renders user avatar and opens menu on click", () => {
    render(<Header onMenuClick={onMenuClickMock} />);

    const avatar = screen.getByRole("img");
    expect(avatar).toHaveAttribute("src", "avatar.jpg");

    fireEvent.click(avatar);

    expect(screen.getByText("Test User")).toBeInTheDocument();
    expect(screen.getByText("test@example.com")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Sign out")).toBeInTheDocument();
  });

  it("calls navigate on logout", () => {
    render(<Header onMenuClick={onMenuClickMock} />);

    fireEvent.click(screen.getByRole("img"));
    fireEvent.click(screen.getByText("Sign out"));

    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });
  it("call navigate to profile", () => {
    render(<Header onMenuClick={onMenuClickMock} />);

    fireEvent.click(screen.getByRole("img"));
    fireEvent.click(screen.getByText("Profile"));

    expect(mockNavigate).toHaveBeenCalledWith("/admin/profile");
  });

  it("call navigate to settings", () => {
    render(<Header onMenuClick={onMenuClickMock} />);

    fireEvent.click(screen.getByRole("img"));
    fireEvent.click(screen.getByText("Settings"));

    expect(mockNavigate).toHaveBeenCalledWith("/admin/settings");
  });


});
