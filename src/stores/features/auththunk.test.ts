import { describe, it, expect, vi } from "vitest";
import { login, register, newpass, setNewPassword } from "./auththunk";
import { setCredentials } from "./authslice";
import * as authService from "../../services/authser";

vi.mock("../../services/authser", () => ({
  loginuser: vi.fn(),
  registeruser: vi.fn(),
  newpassword: vi.fn(),
  setpassword: vi.fn(),
}));

vi.mock("./authslice", () => ({
  setCredentials: vi.fn(),
}));

describe("authThunks", () => {
  it("should handle login successfully", async () => {
    const mockDispatch = vi.fn();
    const userData = { email: "test@example.com", password: "password123" };
    const mockResponse = {
      _id: "1",
      name: "John Doe",
      email: "test@example.com",
      role: "user",
      token: "mocked-token",
      message: "Login successful",
    };

    vi.mocked(authService.loginuser).mockResolvedValue(mockResponse);

    const result = await login(userData)(mockDispatch, () => {}, undefined);

    expect(mockDispatch).toHaveBeenCalledWith(
      setCredentials({
        _id: "1",
        name: "John Doe",
        email: "test@example.com",
        role: "user",
        token: "mocked-token",
      })
    );
    expect(result).toEqual({
      type: "auth/login/fulfilled",
      payload: {
        data: mockResponse,
        message: "Login successful",
      },
      meta: expect.any(Object),
    });
  });

  it("should handle register successfully", async () => {
    const userData = { name: "Jane Doe", email: "jane@example.com", password: "password123", role: "user" };
    const mockResponse = { message: "Registration successful" };

    vi.mocked(authService.registeruser).mockResolvedValue(mockResponse);

    const mockDispatch = vi.fn();
    const mockGetState = vi.fn();
    const result = await register(userData)(mockDispatch, mockGetState, undefined);

    expect(result).toEqual({
      type: "auth/register/fulfilled",
      payload: {
        data: mockResponse,
        message: "Registration successful",
      },
      meta: expect.any(Object),
    });
  });

  it("should handle new password update successfully", async () => {
    const userData = { currentPassword: "oldpass", newPassword: "newpass" };
    const mockResponse = { message: "Password updated successfully" };

    vi.mocked(authService.newpassword).mockResolvedValue(mockResponse);

    const result = await newpass(userData)(vi.fn(), vi.fn(), undefined);

    expect(result).toEqual({
      type: "auth/newpass/fulfilled",
      payload: {
        data: mockResponse,
        message: "Password updated successfully",
      },
      meta: expect.any(Object),
    });
  });

  it("should handle setting a new password successfully", async () => {
    const userData = { token: "mocked-token", password: "newpass" };
    const mockResponse = { message: "Password set successfully" };

    vi.mocked(authService.setpassword).mockResolvedValue(mockResponse);

    const result = await setNewPassword(userData)(vi.fn(), vi.fn(), undefined);

    expect(result).toEqual({
      type: "auth/setNewPassword/fulfilled",
      payload: {
        data: mockResponse,
        message: "Password set successfully",
      },
      meta: expect.any(Object),
    });
  });
});
