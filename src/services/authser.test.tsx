import { describe, it, expect, vi, beforeEach, MockedFunction } from "vitest";
import axios from "axios";
import * as authService from "./authser";
import { isAdmin } from "./IsAdmin";

const mockedAxios = vi.mocked(axios);

vi.mock("axios");
vi.mock("./IsAdmin", () => {
  const mockIsAdmin = vi.fn();
  return {
    isAdmin: mockIsAdmin,
  };
});

let mockIsAdmin: MockedFunction<() => boolean>;

beforeEach(() => {
  mockIsAdmin = vi.mocked(isAdmin);
  localStorage.setItem("token", "mocked-token");
});

describe("authService (User Tests)", () => {
  it("should register a user", async () => {
    const userData = { name: "John", email: "john@example.com", password: "123456", role: "user" };
    const mockResponse = { data: { success: true } };
vi.mocked(mockedAxios.post).mockResolvedValueOnce(mockResponse);

    const result = await authService.registeruser(userData);
    expect(result).toEqual(mockResponse.data);
    expect(mockedAxios.post).toHaveBeenCalledWith("http://localhost:3000/api/auth/register", userData);
  });

  it("should login a user", async () => {
    const credentials = { email: "john@example.com", password: "123456" };
    const mockResponse = { data: { token: "mocked-token" } };
vi.mocked(mockedAxios.post).mockResolvedValueOnce(mockResponse);

    const result = await authService.loginuser(credentials);
    expect(result).toEqual(mockResponse.data);
    expect(mockedAxios.post).toHaveBeenCalledWith("http://localhost:3000/api/auth/login", credentials);
  });

  it("should change user password", async () => {
    const credentials = { currentPassword: "123456", newPassword: "654321" };
    const mockResponse = { data: { success: true } };
vi.mocked(mockedAxios.post).mockResolvedValueOnce(mockResponse);

    const result = await authService.newpassword(credentials);
    expect(result).toEqual(mockResponse.data);
    expect(mockedAxios.post).toHaveBeenCalledWith(
      "http://localhost:3000/api/auth/new-password",
      credentials,
      { headers: { Authorization: `Bearer mocked-token` } }
    );
  });

  it("should set new password", async () => {
  const data = { password: "newpass123", token: "reset-token" };
  const mockResponse = { data: { success: true } };

vi.mocked(mockedAxios.post).mockResolvedValueOnce(mockResponse);

  const result = await authService.setpassword(data);

  expect(result).toEqual(mockResponse.data);
expect(mockedAxios.post).toHaveBeenCalledWith(
  expect.stringContaining("/set-password"),
  data,
  expect.any(Object) // allows any config object
);

});

});

describe("authService (Admin Tests)", () => {
  beforeEach(() => {
    mockIsAdmin.mockReturnValue(true);
  });

  it("should get users as admin", async () => {
    const mockResponse = { data: [{ id: 1, name: "Admin User" }] };
vi.mocked(mockedAxios.get).mockResolvedValueOnce(mockResponse);

    const result = await authService.getusers();
    expect(result).toEqual(mockResponse.data);
    expect(mockedAxios.get).toHaveBeenCalledWith(
      "http://localhost:3000/api/auth/getUsers",
      { headers: { Authorization: `Bearer mocked-token` } }
    );
  });

  it("should delete a user as admin", async () => {
    const mockResponse = { data: { success: true } };
vi.mocked(mockedAxios.delete).mockResolvedValueOnce(mockResponse);

    const result = await authService.deleteuser("123");
    expect(result).toEqual(mockResponse.data);
    expect(mockedAxios.delete).toHaveBeenCalledWith(
      "http://localhost:3000/api/auth/delete/123",
      { headers: { Authorization: `Bearer mocked-token` } }
    );
  });

  it("should edit a user as admin", async () => {
    const userId = "123";
    const userData = { name: "Jane", email: "jane@example.com", role: "admin", status: "active" };
    const mockResponse = { data: { success: true } };
vi.mocked(mockedAxios.put).mockResolvedValueOnce(mockResponse);

    const result = await authService.edituser(userId, userData);
    expect(result).toEqual(mockResponse.data);
    expect(mockedAxios.put).toHaveBeenCalledWith(
      "http://localhost:3000/api/auth/Edit/123",
      userData,
      { headers: { Authorization: `Bearer mocked-token` } }
    );
  });

  it("should add a user as admin", async () => {
    const userData = { name: "New User", email: "new@example.com", role: "user" };
    const mockResponse = { data: { success: true } };
vi.mocked(mockedAxios.post).mockResolvedValueOnce(mockResponse);

    const result = await authService.adduser(userData);
    expect(result).toEqual(mockResponse.data);
    expect(mockedAxios.post).toHaveBeenCalledWith(
      "http://localhost:3000/api/auth/AddUser",
      userData,
      { headers: { Authorization: `Bearer mocked-token` } }
    );
  });

  it("should change role as admin", async () => {
    const mockResponse = { data: { success: true } };
vi.mocked(mockedAxios.put).mockResolvedValueOnce(mockResponse);

    const result = await authService.changerole("123", "admin");
    expect(result).toEqual(mockResponse.data);
    expect(mockedAxios.put).toHaveBeenCalledWith(
      "http://localhost:3000/api/auth/EditRole/123",
      { role: "admin" },
      { headers: { Authorization: `Bearer mocked-token` } }
    );
  });

  it("should change status as admin", async () => {
  const userId = "123";
  const status = "pending";
  const mockResponse = { data: { success: true } };

vi.mocked(mockedAxios.put).mockResolvedValueOnce(mockResponse);
  const result = await authService.changestatus(userId, status);

  expect(result).toEqual(mockResponse.data);
 expect(mockedAxios.put).toHaveBeenCalledWith(
  expect.stringContaining("/Status/123"),
  { status },
  expect.objectContaining({
    headers: expect.objectContaining({
      Authorization: expect.stringContaining("mocked-token"),
    }),
  })
);

});



});
