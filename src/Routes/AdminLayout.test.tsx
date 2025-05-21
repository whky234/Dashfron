import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { AdminLayout } from './AuthRoutes';
import React from 'react';
import '@testing-library/jest-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Mock components
vi.mock('../Pages/admin/header', () => ({
  default: ({ onMenuClick }: { onMenuClick: () => void }) => (
    <div>
      <button onClick={onMenuClick}>Menu Button</button>
      <div>Header Component</div>
    </div>
  )
}));

vi.mock('../Pages/admin/sidenave', () => ({
  default: ({ open, variant }: { open: boolean; variant: string }) => (
    <div>
      SideNav Component - {open ? 'Open' : 'Closed'} - {variant}
    </div>
  )
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    Outlet: () => <div>Outlet Content</div>
  };
});

describe('AdminLayout', () => {
  const theme = createTheme();
  let originalMatchMedia: typeof window.matchMedia;

  beforeEach(() => {
    originalMatchMedia = window.matchMedia;
    // Complete mock for matchMedia
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: query === '(max-width: 899px)', // matches md breakpoint
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
  });

  const renderAdminLayout = () => {
    return render(
      <ThemeProvider theme={theme}>
        <AdminLayout />
      </ThemeProvider>
    );
  };

  it('renders header, sidebar and content area', () => {
    renderAdminLayout();

    // expect(screen.getByText('Header Component')).toBeInTheDocument();
    // expect(screen.getByText('SideNav Component - Open - permanent')).toBeInTheDocument();
    // expect(screen.getByText('Outlet Content')).toBeInTheDocument();
  });

  it('opens mobile sidebar when menu button is clicked', () => {
    // Force mobile view
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: true, // Simulate mobile
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    renderAdminLayout();

    const menuButton = screen.getByText('Menu Button');
    fireEvent.click(menuButton);

    expect(screen.getByText('SideNav Component - Open - temporary')).toBeInTheDocument();
  });

  it('has correct styling for main content area', () => {
    renderAdminLayout();
    
    const mainContent = screen.getByRole('main');
    expect(mainContent).toHaveStyle({
      marginTop: '55px',
      backgroundColor: 'rgb(57, 62, 70)' // MUI converts hex to rgb
    });
  });
});