import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import {  Typography, Paper } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../stores/store";

const UserStatsChart: React.FC = () => {
  const { users } = useSelector((state: RootState) => state.userManagement);

  // Dynamically compute the number of active and pending users
  const stats = useMemo(() => {
    const active = users.filter((u) => u.status === "active").length;
    const pending = users.filter((u) => u.status === "pending").length;

    return [{ name: "Users", Active: active, Pending: pending }];
  }, [users]);

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom fontWeight="bold">
        User Activity Overview
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={stats}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          barSize={40}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="Active" fill="#4caf50" radius={[5, 5, 0, 0]} />
          <Bar dataKey="Pending" fill="#ff9800" radius={[5, 5, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default UserStatsChart;
