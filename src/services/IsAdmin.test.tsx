import { afterEach, describe, expect, it } from 'vitest';
import { isAdmin } from './IsAdmin';

describe('isAdmin', () => {
  afterEach(() => {
    localStorage.clear();
  });

  it('should return true if the user role is admin', () => {
    const mockUser = { role: 'admin' };
    localStorage.setItem('user', JSON.stringify(mockUser));

    const result = isAdmin();

    expect(result).toBe(true);
  });

  it('should return false if the user role is not admin', () => {
    const mockUser = { role: 'user' };
    localStorage.setItem('user', JSON.stringify(mockUser));

    const result = isAdmin();

    expect(result).toBe(false);
  });

  it('should return false if no user is stored in localStorage', () => {
    const result = isAdmin();

    expect(result).toBe(false);
  });
});