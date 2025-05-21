/* eslint-disable react-refresh/only-export-components */
import { describe, it, expect, vi, beforeEach } from "vitest";
import * as productService from "./product";
import axios, { AxiosHeaders } from "axios";

// Mock axios and localStorage
vi.mock("axios");

vi.stubGlobal("localStorage", {
  getItem: vi.fn(() => "mock-token"),
});

// Cast axios as mocked
const mockedAxios = vi.mocked(axios);

describe("productService", () => {
  const mockHeaders = {
    headers: new AxiosHeaders(),
  };

  beforeEach(() => {
    vi.clearAllMocks(); // Reset mocks before each test
  });

  it("should fetch products", async () => {
    const mockResponse = {
      data: [{ id: 1, name: "Product 1" }],
      status: 200,
      statusText: "OK",
      headers: {},
      config: { headers: mockHeaders },
    };

vi.mocked(mockedAxios.get).mockResolvedValueOnce(mockResponse);

    const result = await productService.getproduct();
    expect(mockedAxios.get).toHaveBeenCalledWith(
      "http://localhost:3000/api/product/getProduct",
      {
        headers: { Authorization: `Bearer mock-token` },
      }
    );
    expect(result).toEqual(mockResponse);
  });

  it("should add a product", async () => {
    const productData = { name: "New Product" };
    const mockResponse = {
      data: { success: true },
      status: 201,
      statusText: "Created",
      headers: {},
      config: { headers: mockHeaders },
    };

vi.mocked(mockedAxios.post).mockResolvedValueOnce(mockResponse);

    const result = await productService.Addproduct(productData);
    expect(mockedAxios.post).toHaveBeenCalledWith(
      "http://localhost:3000/api/product/createProduct",
      productData,
      {
        headers: { Authorization: `Bearer mock-token` },
      }
    );
    expect(result).toEqual(mockResponse);
  });

  it("should update a product", async () => {
    const productId = "123";
    const productData = { name: "Updated Product" };
    const mockResponse = {
      data: { success: true },
      status: 200,
      statusText: "OK",
      headers: {},
      config: { headers: mockHeaders },
    };

vi.mocked(mockedAxios.put).mockResolvedValueOnce(mockResponse);

    const result = await productService.updateproduct(productId, productData);
    expect(mockedAxios.put).toHaveBeenCalledWith(
      `http://localhost:3000/api/product/update/${productId}`,
      productData,
      {
        headers: { Authorization: `Bearer mock-token` },
      }
    );
    expect(result).toEqual(mockResponse);
  });

  it("should delete a product", async () => {
    const productId = "123";
    const mockResponse = {
      data: { success: true },
      status: 200,
      statusText: "OK",
      headers: {},
      config: { headers: mockHeaders },
    };

vi.mocked(mockedAxios.delete).mockResolvedValueOnce(mockResponse);

    const result = await productService.deleteproduct(productId);
    expect(mockedAxios.delete).toHaveBeenCalledWith(
      `http://localhost:3000/api/product/delete/${productId}`,
      {
        headers: { Authorization: `Bearer mock-token` },
      }
    );
    expect(result).toEqual(mockResponse);
  });

  it("should handle errors", async () => {
    const errorMessage = "Network Error";
    vi.mocked(mockedAxios.get).mockRejectedValueOnce(new Error(errorMessage));

    await expect(productService.getproduct()).rejects.toThrow(errorMessage);
  });

  it("should handle errors on add product", async () => {
    const errorMessage = "Network Error";
    vi.mocked(mockedAxios.post).mockRejectedValueOnce(new Error(errorMessage));

    await expect(productService.Addproduct({})).rejects.toThrow(errorMessage);
  });

  it("should handle errors on update product", async () => {
    const errorMessage = "Network Error";
    vi.mocked(mockedAxios.put).mockRejectedValueOnce(new Error(errorMessage));

    await expect(productService.updateproduct("123", {})).rejects.toThrow(
      errorMessage
    );
  });

  it("should handle errors on delete product", async () => {
    const errorMessage = "Network Error";
    vi.mocked(mockedAxios.delete).mockRejectedValueOnce(new Error(errorMessage));

    await expect(productService.deleteproduct("123")).rejects.toThrow(
      errorMessage
    );
  });
  
});
