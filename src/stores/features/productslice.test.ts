import { describe, it, expect, vi, beforeEach } from 'vitest';
import reducer, {
  fetchproduct,
  addproduct,
  editproduct,
  delproduct,
  clearMessages,
} from '../features/productslice';
import * as product from '../../services/product';
import { AxiosHeaders } from 'axios';

// ✅ Mock the service module
vi.mock('../../services/product', () => ({
  getproduct: vi.fn(),
  Addproduct: vi.fn(),
  updateproduct: vi.fn(),
  deleteproduct: vi.fn(),
}));

const initialState = {
  products: [],
  loading: false,
  error: null,
  message: null,
};

describe('Product slice async thunks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch products successfully', async () => {
    const mockProducts = [{ _id: '1', name: 'Mock Product' }];

    // ✅ Cast to mocked version
    (product.getproduct as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: { product: mockProducts },
    });

    const thunk = fetchproduct();
    const dispatch = vi.fn();
    const getState = vi.fn();

    const result = await thunk(dispatch, getState, undefined as any);
    expect(result.payload).toEqual(mockProducts);
  });

  it('should handle fetch error', async () => {
    (product.getproduct as ReturnType<typeof vi.fn>).mockRejectedValue({
      response: { data: { message: 'Error' } },
    });

    const action = await fetchproduct()(vi.fn(), {}, undefined);
    expect(action.payload).toBe('Error');
  });

  it('should add product', async () => {
    const newProduct = { _id: '2', name: 'New' };

    (product.Addproduct as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: newProduct,
    });

    const action = await addproduct(newProduct)(vi.fn(), {}, undefined);
    expect(action.payload?.data).toEqual(newProduct);
  });


  // You can add similar mocks for editproduct and delproduct
  

});
describe('ProductSlice Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return initial state', () => {
    expect(reducer(undefined, { type: "unknown" })).toEqual(initialState);
  });

   it("should handle clearMessages", () => {
    const stateWithMessages = {
      ...initialState,
      error: "Some error",
      message: "Some message",
      loading: true,
    };
    const state = reducer(stateWithMessages, clearMessages());
    expect(state.error).toBeNull();
    expect(state.message).toBeNull();
    expect(state.loading).toBe(false);
  });

  describe('fetchproduct thunk', () => {

    
    it('should handle fetchproduct.pending', () => {
    const state = reducer(initialState, { type: fetchproduct.pending.type });
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });
    it('should handle fulfilled state', async () => {
        const mockProducts = [{
            _id: '1',
            name: 'Product 1',
            description: 'Description 1',
            price: 100,
            image: 'image1.jpg',
            category: 'Category 1',
            stock: 10
        }];
        vi.spyOn(product, 'getproduct').mockResolvedValue({
            data: { product: mockProducts },
            status: 200,
            statusText: 'OK',
            headers: new AxiosHeaders(),
            config: { headers: new AxiosHeaders() }
        });

        const state = reducer(initialState, { type: fetchproduct.fulfilled.type, payload: mockProducts });
        expect(state.products).toEqual(mockProducts);
        expect(state.loading).toBe(false);
    });

    it('should handle rejected state', () => {
        const errorMessage = 'Failed to fetch';
        const state = reducer(initialState, { type: fetchproduct.rejected.type, payload: errorMessage });
        expect(state.error).toBe(errorMessage);
        expect(state.loading).toBe(false);
    });
});

describe('addproduct thunk', () => {

    it('should handle addproduct.pending', () => {
    const state = reducer(initialState, { type: addproduct.pending.type });
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });



    it('should handle fulfilled state', () => {
        const newProduct = {
            _id: '2',
            name: 'Product 2',
            description: 'Description 2',
            price: 200,
            image: 'image2.jpg',
            category: 'Category 2',
            stock: 20
        };
        const state = reducer(initialState, { type: addproduct.fulfilled.type, payload: { data: newProduct, message: 'Product added successfully' } });
        expect(state.products).toContainEqual(newProduct);
        expect(state.message).toBe('Product added successfully');
        expect(state.loading).toBe(false);
    });

    it('should handle rejected state', () => {
        const errorMessage = 'Failed to add';
        const state = reducer(initialState, { type: addproduct.rejected.type, payload: errorMessage });
        expect(state.error).toBe(errorMessage);
        expect(state.loading).toBe(false);
    });
});

describe('editproduct thunk', () => {

      it('should handle editproduct.pending', () => {
    const state = reducer(initialState, { type: editproduct.pending.type });
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

    it('should handle fulfilled state', () => {
        const updatedProduct = {
            _id: '1',
            name: 'Updated Product',
            description: 'Updated Description',
            price: 150,
            image: 'updated_image.jpg',
            category: 'Updated Category',
            stock: 15
        };
        const stateWithProduct = {
            ...initialState,
            products: [{
                _id: '1',
                name: 'Product 1',
                description: 'Description 1',
                price: 100,
                image: 'image1.jpg',
                category: 'Category 1',
                stock: 10
            }]
        };
        const state = reducer(stateWithProduct, { type: editproduct.fulfilled.type, payload: { data: updatedProduct, message: 'Product updated successfully' } });
        expect(state.products).toContainEqual(updatedProduct);
        expect(state.message).toBe('Product updated successfully');
        expect(state.loading).toBe(false);
    });

    it('should handle rejected state', () => {
        const errorMessage = 'Failed to update';
        const state = reducer(initialState, { type: editproduct.rejected.type, payload: errorMessage });
        expect(state.error).toBe(errorMessage);
        expect(state.loading).toBe(false);
    });
});


describe('delproduct thunk', () => {
  it('should handle delproduct.pending', () => {
    const state = reducer(initialState, { type: delproduct.pending.type });
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
    expect(state.message).toBeNull();
  });

  it('should handle fulfilled state', () => {
    const existingProduct = {
      _id: '1',
      name: 'Product 1',
      description: 'Desc',
      price: 100,
      image: 'image.jpg',
      category: 'Cat',
      stock: 5
    };

    const stateWithProducts = {
      ...initialState,
      products: [existingProduct]
    };

    const payload = {
      data: '1', // product id
      message: 'Product deleted successfully'
    };

    const state = reducer(stateWithProducts, { type: delproduct.fulfilled.type, payload });
    expect(state.products).toEqual([]);
    expect(state.message).toBe('Product deleted successfully');
    expect(state.loading).toBe(false);
  });

  it('should handle rejected state', () => {
    const errorMessage = 'Failed to delete';
    const state = reducer(initialState, { type: delproduct.rejected.type, payload: errorMessage });
    expect(state.error).toBe(errorMessage);
    expect(state.loading).toBe(false);
  });
});


});



