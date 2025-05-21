import React, { act } from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { store } from "../stores/store";
import { AuthGuard } from "./Authgaurd";
import "@testing-library/jest-dom";
import { describe, expect, it } from "vitest";

describe("AuthGuard Component (Integration Test)", () => {
  it("redirects to login if no token is present", () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/protected"]}>
          <Routes>
            <Route
              path="/protected"
              element={<AuthGuard role="admin"><div>Protected Page</div></AuthGuard>}
            />
            <Route path="/login" element={<div>Login Page</div>} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });

  it("redirects to login if user role does not match", () => {
    // Simulate a logged-in user with a different role
    act(() => {
      store.dispatch({
        type: "auth/setCredentials",
        payload: {
          _id: "1",
          name: "Test User",
          email: "test@example.com",
          role: "user",
          token: "valid-token",
        },
      });
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/protected"]}>
          <Routes>
            <Route
              path="/protected"
              element={<AuthGuard role="admin"><div>Protected Page</div></AuthGuard>}
            />
            <Route path="/login" element={<div>Login Page</div>} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });

  it("renders the protected content if user role matches", () => {
    // Simulate a logged-in user with the correct role
    act(() => {
      store.dispatch({
        type: "auth/setCredentials",
        payload: {
          _id: "1",
          name: "Admin User",
          email: "admin@example.com",
          role: "admin",
          token: "valid-token",
        },
      });
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/protected"]}>
          <Routes>
            <Route
              path="/protected"
              element={<AuthGuard role="admin"><div>Protected Page</div></AuthGuard>}
            />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText("Protected Page")).toBeInTheDocument();
  });
});