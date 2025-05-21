import React from "react";
import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useSelector } from "react-redux";
import UserStatsChart from "./userchart";
import "@testing-library/jest-dom";

// 🧪 Mock MUI components
vi.mock("@mui/material", () => ({
Typography: ({ children }: any) => <div>{children}</div>,
}));

// 🧪 Mock recharts
vi.mock("recharts", () => ({
ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
BarChart: ({ children }: any) => <div data-testid="barchart">{children}</div>,
Bar: () => <div data-testid="bar" />,
XAxis: () => <div data-testid="x-axis" />,
YAxis: () => <div data-testid="y-axis" />,
CartesianGrid: () => <div data-testid="grid" />,
Tooltip: () => <div data-testid="tooltip" />,
Legend: () => <div data-testid="legend" />,
}));

// 🧪 Mock PaperWrapper
vi.mock("../../hooks/paper", () => ({
default: ({ children }: any) => <div data-testid="paper">{children}</div>,
}));

// 🧪 Mock Redux useSelector
vi.mock("react-redux", async () => {
const actual: any = await vi.importActual("react-redux");
return {
...actual,
useSelector: vi.fn(),
};
});

describe("UserStatsChart", () => {
beforeEach(() => {
(useSelector as vi.Mock).mockImplementation((cb) =>
cb({
userManagement: {
users: [
{ status: "active" },
{ status: "active" },
{ status: "pending" },
],
},
})
);
});

afterEach(() => {
vi.clearAllMocks();
});

it("renders chart with correct title and chart components", () => {
render(<UserStatsChart />);
expect(screen.getByText("User Activity Overview")).toBeInTheDocument();
expect(screen.getByTestId("paper")).toBeInTheDocument();
expect(screen.getByTestId("barchart")).toBeInTheDocument();
expect(screen.getAllByTestId("bar")).toHaveLength(2); // Active + Pending
expect(screen.getByTestId("x-axis")).toBeInTheDocument();
expect(screen.getByTestId("y-axis")).toBeInTheDocument();
expect(screen.getByTestId("tooltip")).toBeInTheDocument();
expect(screen.getByTestId("legend")).toBeInTheDocument();
});
});