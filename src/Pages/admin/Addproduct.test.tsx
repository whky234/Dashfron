import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProductForm from './Addproduct';
import React from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { Product } from '../../Types/Product';

// ✅ Mock navigation and params
const mockNavigate = vi.fn();
const mockUseParams = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => mockUseParams(),
  };
});

// ✅ Mock redux
const mockDispatch = vi.fn();

type ProductState = {
  products: Product[];
  loading: boolean;
  error: string | null;
  message: string;
};

const mockSelectorState: { product: ProductState } = {
  product: {
    products: [],
    loading: false,
    error: null,
    message: '',
  },
};

vi.mock('react-redux', async () => {
  const actual = await vi.importActual<typeof import('react-redux')>('react-redux');
  return {
    ...actual,
    useDispatch: () => mockDispatch,
    useSelector: (fn: any) => fn(mockSelectorState),
  };
});

// ✅ Mock other hooks and components
vi.mock('../../hooks/Handlemessage', () => ({ default: vi.fn() }));

vi.mock('@mui/material', async () => {
  const actual = await vi.importActual<typeof import('@mui/material')>('@mui/material');
  return {
    ...actual,
    useMediaQuery: vi.fn(),
    useTheme: vi.fn(),
    Button: ({ children,  }: any) => (
      <button  data-testid="button">
        {children}
      </button>
    ),
    
  };
});


vi.mock('@mui/material/CircularProgress', () => ({
  __esModule: true,
  default: () => <div data-testid="circular-progress" />,
}));
vi.mock('@mui/material/Typography', () => ({
  __esModule: true,
  default: ({ children }: any) => <div>{children}</div>,
}));
vi.mock('@mui/material/Grid', () => ({
  __esModule: true,
  default: ({ children }: any) => <div>{children}</div>,
}));
vi.mock('@mui/material/Box', () => ({
  __esModule: true,
  default: ({ children }: any) => <div>{children}</div>,
}));



vi.mock('../../hooks/whiteTextfield', () => ({
  __esModule: true,
  default: ({ label, name, value, onChange,  }: any) => (
    <input
      data-testid={`textfield-${name}`}
      name={name}
      value={value}
      onChange={onChange}
      aria-label={label}
    />
  ),
}));

vi.mock('../../hooks/paper', () => ({
  __esModule: true,
  default: ({ children }: any) => <div data-testid="paper-wrapper">{children}</div>,
}));

describe('<ProductForm /> unit Test ', () => {
  const setSnackBarMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseParams.mockReturnValue({ id: undefined });
    mockSelectorState.product.products = [];
  });

  it('renders Add Product form correctly', () => {
    render(<ProductForm setSnackBar={setSnackBarMock} />);

    expect(screen.getByText('Add New Product')).toBeInTheDocument();
    expect(screen.getByTestId('textfield-name')).toBeInTheDocument();
    expect(screen.getByTestId('textfield-description')).toBeInTheDocument();
    expect(screen.getByTestId('textfield-price')).toBeInTheDocument();
    expect(screen.getByTestId('textfield-stock')).toBeInTheDocument();
    expect(screen.getByTestId('textfield-category')).toBeInTheDocument();
  });

  it('submits form and dispatches addproduct action', async () => {
    render(<ProductForm setSnackBar={setSnackBarMock} />);

    fireEvent.change(screen.getByTestId('textfield-name'), {
      target: { value: 'New Product', name: 'name' },
    });
    fireEvent.change(screen.getByTestId('textfield-description'), {
      target: { value: 'Awesome product', name: 'description' },
    });
    fireEvent.change(screen.getByTestId('textfield-price'), {
      target: { value: '50', name: 'price' },
    });
    fireEvent.change(screen.getByTestId('textfield-stock'), {
      target: { value: '20', name: 'stock' },
    });
    fireEvent.change(screen.getByTestId('textfield-category'), {
      target: { value: 'Tools', name: 'category' },
    });

    fireEvent.click(screen.getByRole('button', { name: /add product/i }));

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
    });
  });

  it('renders Edit Product form with existing data', () => {
    mockUseParams.mockReturnValue({ id: '123' });
    mockSelectorState.product.products = [
      {
        _id: '123',
        name: 'Existing Product',
        description: 'Old description',
        price: 99,
        stock: 10,
        image: '',
        category: 'Electronics',
      },
    ]as Product[];

    render(<ProductForm setSnackBar={setSnackBarMock} />);

    expect(screen.getByText('Edit Product')).toBeInTheDocument();
  });

  it('handles image upload correctly', async () => {
    render(<ProductForm setSnackBar={setSnackBarMock} />);

    const file = new File(['dummy content'], 'example.png', { type: 'image/png' });
    const input = screen.getByTestId('textfield-image');

    fireEvent.change(input, {
      target: { files: [file] },
    });

    await waitFor(() => {
      const previewImage = screen.getByAltText('Product') as HTMLImageElement;
      expect(previewImage).toBeInTheDocument();
      expect(previewImage.src).toContain('data:image');
    });
  });

  it('displays loading spinner when loading is true', () => {
    mockSelectorState.product.loading = true;

    render(<ProductForm setSnackBar={setSnackBarMock} />);

    expect(screen.getByTestId('circular-progress')).toBeInTheDocument();
  });


});
