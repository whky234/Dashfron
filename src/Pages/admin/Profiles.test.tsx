import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ProfileForm from "./Profile"; // Ensure this is the correct path
import "@testing-library/jest-dom";

// Mocks
const mockDispatch = vi.fn();

vi.mock("react-redux", async () => {
  const actual = await vi.importActual("react-redux");
  return {
    ...actual,
    useDispatch: () => mockDispatch,
    useSelector: (selector: any) =>
      selector({
        profiles: {
          profile: {
            username: "Hasnain",
            profilePicture: "dummy.png",
            phone: "123456789",
            bio: "This is a test bio",
            location: "Test City",
            dateOfBirth: "2000-01-01",
            gender: "male",
          },
          loading: false,
          message: null,
          error: null,
        },
      }),
  };
});

vi.mock("../../stores/features/profileslice", () => ({
  fetchProfile: () => ({ type: "FETCH_PROFILE" }),
  saveProfile: (data: any) => ({ type: "SAVE_PROFILE", payload: data }),
  clearMessages: () => ({ type: "CLEAR_MESSAGES" }),
  selectProfile: (state: any) => state.profiles,
}));

vi.mock("../../hooks/paper", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("../../hooks/Handlemessage", () => ({
  __esModule: true,
  default: () => null,
}));

vi.mock("../../hooks/whiteTextfield", () => ({
  __esModule: true,
  default: ({ label, name, value, onChange }: any) => (
    <input
      data-testid={`textfield-${name}`}
      name={name}
      value={value}
      onChange={onChange}
      aria-label={label}
    />
  ),
}));

vi.mock("@mui/material", async () => {
  const actual = await vi.importActual("@mui/material");
  return {
    ...actual,
    Grid: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Typography: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Button: ({ children, onClick }: any) => <button onClick={onClick}>{children}</button>,
    Divider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Box: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Avatar: ({ src, alt }: any) => (
      <img src={src} alt={alt} data-testid="avatar" />
    ),
    CircularProgress: () => <div data-testid="circular-progress" />,
    MenuItem: ({ children }: any) => <option>{children}</option>,
    Container: ({ children }: any) => <div>{children}</div>,
  };
});

// Tests
describe("ProfileForm Component", () => {
  beforeEach(() => {
    mockDispatch.mockClear();
  });

  it("renders form fields with profile data", () => {
    render(<ProfileForm setSnackBar={() => {}} />);

    expect(screen.getByTestId("textfield-username")).toHaveValue("Hasnain");
    expect(screen.getByTestId("textfield-phone")).toHaveValue("123456789");
    expect(screen.getByTestId("textfield-bio")).toHaveValue("This is a test bio");
    expect(screen.getByTestId("textfield-location")).toHaveValue("Test City");
    expect(screen.getByTestId("textfield-dateOfBirth")).toHaveValue("2000-01-01");
  });

  it("dispatches saveProfile and fetchProfile on submit", () => {
    render(<ProfileForm setSnackBar={() => {}} />);

    const button = screen.getByText("Save Profile");
    fireEvent.click(button);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: "SAVE_PROFILE",
      payload: {
        profile: {
          username: "Hasnain",
          profilePicture: "dummy.png",
          phone: "123456789",
          bio: "This is a test bio",
          location: "Test City",
          dateOfBirth: "2000-01-01",
          gender: "male",
        },
      },
    });

    expect(mockDispatch).toHaveBeenCalledWith({ type: "FETCH_PROFILE" });
  });

  it("handles input changes correctly", () => {
    render(<ProfileForm setSnackBar={() => {}} />);

    const usernameInput = screen.getByTestId("textfield-username");
    fireEvent.change(usernameInput, { target: { value: "NewUsername" } });
    expect(usernameInput).toHaveValue("NewUsername");

    const phoneInput = screen.getByTestId("textfield-phone");
    fireEvent.change(phoneInput, { target: { value: "987654321" } });
    expect(phoneInput).toHaveValue("987654321");

    const imageInput = screen.getByTestId("textfield-profilePicture");  
    fireEvent.change(imageInput, {
      target: { files: [new Blob(["dummy"], { type: "image/png" })] },
    });
    expect(imageInput.files[0]).toBeDefined();
    expect(imageInput.files[0].type).toBe("image/png");
  });
 




});
