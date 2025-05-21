import { describe, it, expect } from "vitest";
import { isTokenExpired } from "./tokenutils";

const createToken = (exp: number) => {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(JSON.stringify({ exp }));
  const signature = "dummy-signature";
  return `${header}.${payload}.${signature}`;
};

describe("isTokenExpired", () => {
  it("returns false for a valid non-expired token", () => {
    const futureTimestamp = Math.floor(Date.now() / 1000) + 60; // expires in 60s
    const token = createToken(futureTimestamp);
    expect(isTokenExpired(token)).toBe(false);
  });

  it("returns true for an expired token", () => {
    const pastTimestamp = Math.floor(Date.now() / 1000) - 60; // expired 60s ago
    const token = createToken(pastTimestamp);
    expect(isTokenExpired(token)).toBe(true);
  });

  it("returns true for a malformed token", () => {
    const badToken = "not.a.valid.token";
    expect(isTokenExpired(badToken)).toBe(true);
  });

  it("returns true if exp is missing", () => {
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const payload = btoa(JSON.stringify({ name: "No Exp" }));
    const signature = "signature";
    const token = `${header}.${payload}.${signature}`;
    expect(isTokenExpired(token)).toBe(true);
  });
});
