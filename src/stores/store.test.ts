import { store } from './store';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('Redux Store', () => {
  it('should have the correct initial state', () => {
    const state = store.getState();

    expect(state).toHaveProperty('auth');
    expect(state).toHaveProperty('userManagement');
    expect(state).toHaveProperty('product');
    expect(state).toHaveProperty('profile');

    expect(state.auth).toBeDefined();
    expect(state.userManagement).toBeDefined();
    expect(state.product).toBeDefined();
    expect(state.profile).toBeDefined();
  });

  it('should dispatch actions correctly', () => {
    const action = { type: 'TEST_ACTION' };
    expect(() => store.dispatch(action)).not.toThrow();
  });

  it('should return the correct dispatch type', () => {
    const dispatch = store.dispatch;
    expect(typeof dispatch).toBe('function');
  });

  it('should return the correct state type', () => {
    const state = store.getState();
    expect(typeof state).toBe('object');
  });
});
