import { describe, it, expect, vi, beforeEach } from "vitest";
import * as profileService from "./profile";
import axios from "axios";

// Mock axios
vi.mock("axios");

// Stub localStorage globally
vi.stubGlobal("localStorage", {
  getItem: vi.fn(() => "mock-token"),
});

// Cast axios as mocked
const mockedAxios = vi.mocked(axios, true);

describe("profileService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch profile data", async () => {
    const mockResponse = {
      data: { username: "JohnDoe", bio: "Hello World" },
    };

    mockedAxios.get.mockResolvedValueOnce(mockResponse);

    const result = await profileService.getProfile();

    expect(mockedAxios.get).toHaveBeenCalledWith(
      "http://localhost:3000/api/profile",
      {
        headers: { Authorization: `Bearer mock-token` },
      }
    );

    expect(result).toEqual(mockResponse.data);
  });

  it("should update profile data", async () => {
    const profileData = { username: "JaneDoe", bio: "Updated Bio" };
    const mockResponse = {
      data: { success: true },
    };

    mockedAxios.put.mockResolvedValueOnce(mockResponse);

    const result = await profileService.updateProfile(profileData);

    expect(mockedAxios.put).toHaveBeenCalledWith(
      "http://localhost:3000/api/profile/add",
      profileData,
      {
        headers: { Authorization: `Bearer mock-token` },
      }
    );

    expect(result).toEqual(mockResponse.data);
  });

  it("should handle errors when fetching profile data", async () => {
    const mockError = new Error("Network Error");
    mockedAxios.get.mockRejectedValueOnce(mockError);

    await expect(profileService.getProfile()).rejects.toThrow("Network Error");
  });

  it("should handle errors when updating profile data", async () => {
    const profileData = { username: "JaneDoe", bio: "Updated Bio" };
    const mockError = new Error("Network Error");
    mockedAxios.put.mockRejectedValueOnce(mockError);

    await expect(profileService.updateProfile(profileData)).rejects.toThrow(
      "Network Error"
    );
  });
});
