import { describe, it, expect, vi, beforeEach } from 'vitest';
import reducer, { clearMessages, fetchProfile, saveProfile } from './profileslice';


// Default initial state
const initialState = {
  user: null,
  profile: null,
  loading: false,
  error: null,
  message: null,
};

vi.mock('../../services/product', () => ({
  getproduct: vi.fn(),
  Addproduct: vi.fn(),
  updateproduct: vi.fn(),
  deleteproduct: vi.fn(),
}));



describe('profileslice test', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle clearMessages', () => {
    const stateWithMessages = {
      ...initialState,
      error: 'Some error',
      message: 'Some message',
      loading: true,
    };
    const state = reducer(stateWithMessages, clearMessages());
    expect(state.error).toBeNull();
    expect(state.message).toBeNull();
    expect(state.loading).toBe(false);
  });
});

describe('fetchProfile thunk', () => {
  it('should handle fetchProfile.pending', () => {
    const state = reducer(initialState, { type: fetchProfile.pending.type });
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
    expect(state.message).toBeNull();
  });

  it('should handle fetchProfile.fulfilled', () => {
    const mockData = {
      user: { id: '1', username: 'test' },
      profile: { _id: '2', username: 'testuser', profilePicture: 'abc.jpeg', phone: '082383', bio: 'bio' },
    };
    const state = reducer(initialState, { type: fetchProfile.fulfilled.type, payload: mockData });
    expect(state.user).toEqual(mockData.user);
    expect(state.profile).toEqual(mockData.profile);
    expect(state.loading).toBe(false);
  });

  it('should handle fetchProfile.rejected', () => {
    const errorMessage = 'Failed to fetch';
    const state = reducer(initialState, { type: fetchProfile.rejected.type, payload: errorMessage });
    expect(state.error).toBe(errorMessage);
    expect(state.loading).toBe(false);
  });
});

describe('saveProfile thunk', () => {
  it('should handle saveProfile.pending', () => {
    const state = reducer(initialState, { type: saveProfile.pending.type });
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
    expect(state.message).toBeNull();
  });

  it('should handle saveProfile.fulfilled', () => {
    const mockProfile = {
      _id: '2',
      username: 'updateduser',
      profilePicture: 'new.jpeg',
      phone: '099999',
      bio: 'updated bio',
    };

    const payload = {
      profile: mockProfile,
      message: 'Profile updated successfully',
    };

    const state = reducer(initialState, {
      type: saveProfile.fulfilled.type,
      payload,
    });

    expect(state.profile).toEqual(payload);
    expect(state.message).toBe(payload.message);
    expect(state.loading).toBe(false);
  });

  it('should handle saveProfile.rejected', () => {
    const errorMessage = 'Error updating profile';
    const state = reducer(initialState, { type: saveProfile.rejected.type, payload: errorMessage });
    expect(state.error).toBe(errorMessage);
    expect(state.loading).toBe(false);
  });

    
});
