import React, { useEffect, useMemo } from "react";
import {
  Box,
  Stack,
  Typography,
  useTheme,
  useMediaQuery,
  Paper,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../stores/store";
import { Fetchuser } from "../../stores/features/usermangement";
import { fetchproduct } from "../../stores/features/productslice";
import UserStatsChart from "./userchart";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
} from "recharts";
import { AttachMoney, People, Assignment } from "@mui/icons-material";
import StatCard from "./Statcard";

const COLORS = ["#7B61FF", "#00B894", "#FFA726", "#FF6B6B", "#00C49F", "#FFBB28"];

const Analytics: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));

  const { users } = useSelector((state: RootState) => state.userManagement);
  const { products } = useSelector((state: RootState) => state.product);

  useEffect(() => {
    dispatch(Fetchuser());
    dispatch(fetchproduct());
  }, [dispatch]);

  const latestUsers = useMemo(
    () =>
      [...users]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5),
    [users]
  );

  const latestProducts = useMemo(
    () =>
      [...products]
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 5),
    [products]
  );

  const { userStats, productStats, categoryCounts } = useMemo(() => {
    const active = users.filter((u) => u.status === "active").length;
    const pending = users.filter((u) => u.status === "pending").length;
    const totalUsers = users.length;

    const totalProducts = products.length;
    const totalInventoryValue = products.reduce((sum, product) => sum + (product.price || 0), 0);

    const categoryCount = products.reduce((acc: Record<string, number>, p) => {
      const cat = p.category || "Uncategorized";
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {});

    return {
      userStats: { active, pending, total: totalUsers },
      productStats: { total: totalProducts, inventoryValue: totalInventoryValue },
      categoryCounts: categoryCount,
    };
  }, [users, products]);

  const chartData = Object.entries(categoryCounts).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <Box sx={{ px: { xs: 2, sm: 4 }, py: 2 }}>
      {/* Stats Cards */}
      <Stack
        direction="row"
        spacing={2}
        flexWrap="wrap"
        justifyContent="space-between"
        useFlexGap
        sx={{ mb: 4 }}
      >
        <StatCard label="Total Products" value={productStats.total} color="#7B61FF" icon={<Assignment />} />
        <StatCard label="Inventory Value" value={productStats.inventoryValue} color="#00B894" icon={<AttachMoney />} prefix="$" />
        <StatCard label="Active Users" value={userStats.active} color="#FFA726" icon={<People />} />
        <StatCard label="Pending Users" value={userStats.pending} color="#FF6B6B" icon={<People />} />
      </Stack>

      {/* User Chart */}
      <Box sx={{ mb: 4 }}>
        <UserStatsChart />
      </Box>

      {/* Category Breakdown */}
      {chartData.length > 0 && (
        <Paper sx={{ mb: 4, p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            🧩 Category Breakdown
          </Typography>
          <Box sx={{ height: { xs: 300, sm: 400 }, width: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={isSm ? 90 : 120}
                  paddingAngle={5}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                >
                  {chartData.map((_entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      stroke={theme.palette.background.paper}
                      strokeWidth={3}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number, name: string) => {
                    const total = chartData.reduce((sum, entry) => sum + entry.value, 0);
                    const percent = ((value / total) * 100).toFixed(1);
                    return [`${percent}%`, name];
                  }}
                />
                <Legend
                  layout={isSm ? "horizontal" : "vertical"}
                  verticalAlign={isSm ? "bottom" : "middle"}
                  align={isSm ? "center" : "right"}
                />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      )}

      {/* Latest Products & Orders */}
      <Grid container spacing={2}>
        {/* Latest Products */}
        <Grid item xs={12} md={6}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Latest Users
          </Typography>
          <Paper elevation={3}>
            {latestUsers.map((user) => (
              <Box key={user._id} sx={{ p: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {user.name}
                </Typography>
                {user.email && (
                  <Typography variant="body2" color="text.secondary">
                    {user.email}
                  </Typography>
                )}
                <Typography variant="caption" color="text.secondary">
                  Updated At:{" "}
                  {new Date(user.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </Typography>
                <Divider sx={{ mt: 1 }} />
              </Box>
            ))}
          </Paper>
        </Grid>

        {/* Latest Orders */}
        <Grid item xs={12} md={6}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Latest Products
          </Typography>
          <TableContainer component={Paper} elevation={3}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Id</TableCell>
                  <TableCell>Product</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {latestProducts.map((products ) => (
                  <TableRow key={products._id}>
                    <TableCell>Pro-{products._id.substring(0, 6).toUpperCase()}</TableCell>
                    <TableCell>{products.name }</TableCell>
                    <TableCell>
                      {new Date(products.updatedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analytics;
