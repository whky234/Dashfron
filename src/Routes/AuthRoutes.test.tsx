import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthRoutes } from './AuthRoutes';
import React from 'react';
import '@testing-library/jest-dom';



// Mock components
vi.mock('../Components/Auth/Login', () => ({
  Login: () => <div>Login Page</div>
}));

vi.mock('../Components/Auth/Register', () => ({
  Register: () => <div>Register Page</div>
}));

vi.mock('../Components/Auth/setpassword', () => ({
  default: () => <div>Set Password Page</div>
}));

vi.mock('../Pages/admin/sidenave', () => ({
  default: () => <div>SideNav Component</div>
}));

vi.mock('../Pages/admin/header', () => ({
  default: () => <div>Header Component</div>
}));

vi.mock('../Pages/admin/analytics', () => ({
  default: () => <div>Analytics Page</div>
}));

// Mock AuthGuard
vi.mock('../services/Authgaurd', () => ({
  AuthGuard: ({ children, role }: { children: React.ReactNode, role: string }) => (
    <div>
      <div>AuthGuard for {role}</div>
      {children}
    </div>
  )
}));

describe('AuthRoutes', () => {
  const mockSetSnackBar = vi.fn();

  it('renders Login page for root route', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <AuthRoutes setSnackBar={mockSetSnackBar} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Login Page')).toBeInTheDocument();
    });
  });

  it('renders Register page for /register route', async () => {
    render(
      <MemoryRouter initialEntries={['/register']}>
        <AuthRoutes setSnackBar={mockSetSnackBar} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Register Page')).toBeInTheDocument();
    });
  });

  it('renders SetPassword page for /set-password route', async () => {
    render(
      <MemoryRouter initialEntries={['/set-password']}>
        <AuthRoutes setSnackBar={mockSetSnackBar} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Set Password Page')).toBeInTheDocument();
    });
  });

  it('renders Admin layout with AuthGuard for /admin route', async () => {
  render(
    <MemoryRouter initialEntries={['/admin']}>
      <AuthRoutes setSnackBar={mockSetSnackBar} />
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(screen.getByText('AuthGuard for admin')).toBeInTheDocument();
  });
  
  // Don't test for Header/SideNav here - test those in AdminLayout.test.tsx
});
});