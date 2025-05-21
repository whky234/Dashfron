import { describe, it, expect, vi } from "vitest";
import reducer, {
  setCredentials,
  logout,
  clearMessages,
  setMessage,
  setError,
} from "./authslice";
import { login, register, newpass, setNewPassword } from './auththunk';

// Mocking API calls using vi.mock
vi.mock('../services/authser', () => ({
    login: vi.fn().mockResolvedValue({ data: { token: 'mocked-token' } }),
    register: vi.fn().mockResolvedValue({ data: { message: 'Registration successful' } }),
    newpass: vi.fn().mockResolvedValue({ data: { message: 'Password updated successfully' } }),
    setNewPassword: vi.fn().mockResolvedValue({ data: { message: 'Password set successfully' } }),
}));

// Declare initialState before using it
const initialState = {
    user: null,
    token: null,
    loading: false,
    error: null,
    message: null,
};

// Mocking localStorage
const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe("authSlice", () => {
  it("should handle initial state", () => {
    expect(reducer(undefined, { type: "unknown" })).toEqual(initialState);
  });

  it("should handle setCredentials", () => {
    const action = {
      payload: {
        _id: "1",
        name: "John Doe",
        email: "john@example.com",
        role: "user",
        token: "mocked-token",
      },
    };
    const state = reducer(initialState, setCredentials(action.payload));
    expect(state.user).toEqual({
      _id: "1",
      name: "John Doe",
      email: "john@example.com",
      role: "user",
    });
    expect(state.token).toBe("mocked-token");
  });

  it("should handle logout", () => {
    const loggedInState = {
      ...initialState,
      user: { _id: "1", name: "John Doe" },
      token: "mocked-token",
    };
    const state = reducer(loggedInState, logout());
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
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

  it("should handle setMessage", () => {
    const state = reducer(initialState, setMessage("Test message"));
    expect(state.message).toBe("Test message");
    expect(state.error).toBeNull();
  });

  it("should handle setError", () => {
    const state = reducer(initialState, setError("Test error"));
    expect(state.error).toBe("Test error");
    expect(state.message).toBeNull();
  });
});

describe('Extra reducers', () => {
  it('should handle login.pending', () => {
    const state = reducer(initialState, { type: login.pending.type });
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle login.fulfilled', () => {
    const action = {
      payload: {
        data: {
          _id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          role: 'user',
          token: 'mocked-token',
        },
        message: 'Login successful',
      },
    };
    const state = reducer(initialState, { type: login.fulfilled.type, payload: action.payload });
    expect(state.user).toEqual({
      _id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'user',
    });
    expect(state.token).toBe('mocked-token');
    expect(state.message).toBe('Login successful');
    expect(state.loading).toBe(false);
  });

  it('should handle login.rejected', () => {
    const action = { payload: 'Login failed' };
    const state = reducer(initialState, { type: login.rejected.type, payload: action.payload });
    expect(state.error).toBe('Login failed');
    expect(state.loading).toBe(false);
  });

  it('should handle register.pending', () => {
    const state = reducer(initialState, { type: register.pending.type });
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle register.fulfilled', () => {
    const action = { payload: { message: 'Registration successful' } };
    const state = reducer(initialState, { type: register.fulfilled.type, payload: action.payload });
    expect(state.message).toBe('Registration successful');
    expect(state.loading).toBe(false);
  });

  it('should handle register.rejected', () => {
    const action = { payload: 'Registration failed' };
    const state = reducer(initialState, { type: register.rejected.type, payload: action.payload });
    expect(state.error).toBe('Registration failed');
    expect(state.loading).toBe(false);
  });

  it('should handle newpass.pending', () => {
    const state = reducer(initialState, { type: newpass.pending.type });
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle newpass.fulfilled', () => {
    const action = { payload: { message: 'Password updated successfully' } };
    const state = reducer(initialState, { type: newpass.fulfilled.type, payload: action.payload });
    expect(state.message).toBe('Password updated successfully');
    expect(state.loading).toBe(false);
  });

  it('should handle newpass.rejected', () => {
    const action = { payload: 'Password update failed' };
    const state = reducer(initialState, { type: newpass.rejected.type, payload: action.payload });
    expect(state.error).toBe('Password update failed');
    expect(state.loading).toBe(false);
  });

  it('should handle setNewPassword.pending', () => {
    const state = reducer(initialState, { type: setNewPassword.pending.type });
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle setNewPassword.fulfilled', () => {
    const action = { payload: { message: 'Password set successfully' } };
    const state = reducer(initialState, { type: setNewPassword.fulfilled.type, payload: action.payload });
    expect(state.message).toBe('Password set successfully');
    expect(state.loading).toBe(false);
  });

  it('should handle setNewPassword.rejected', () => {
    const action = { payload: 'Password set failed' };
    const state = reducer(initialState, { type: setNewPassword.rejected.type, payload: action.payload });
    expect(state.error).toBe('Password set failed');
    expect(state.loading).toBe(false);
  });

  // Example usage of mocked API calls
  it('should call login API and update state', async () => {
    const action = {
        type: login.fulfilled.type,
        payload: {
            data: {
                _id: '1',
                name: 'John Doe',
                email: 'john@example.com',
                role: 'user',
                token: 'mocked-token',
            },
            message: 'Login successful',
        },
    };
    const state = reducer(initialState, action);
    expect(state.user).toEqual({
        _id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'user',
    });
    expect(state.token).toBe('mocked-token');
    expect(state.message).toBe('Login successful');
  });
});
