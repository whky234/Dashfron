import React, { useEffect, useMemo } from "react";
import {
  Box,
  Stack,
  Typography,
  useTheme,
  useMediaQuery,
  Divider,

 
  IconButton,
} from "@mui/material";
import Grid from '@mui/material/Grid'; // preferred for TS accuracy

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../stores/store";
import { Fetchuser } from "../../stores/features/usermangement";
import { fetchproduct } from "../../stores/features/productslice";
import UserStatsChart from "./userchart";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'; // Make sure this is imported

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
} from "recharts";
import { AttachMoney, People, Assignment } from "@mui/icons-material";
import StatCard from "../../hooks/Statcard";
import ReusableTable from "../../hooks/reuseabletable";
import PaperWrapper from "../../hooks/paper";
import { useNavigate } from "react-router-dom";

const COLORS = ["#7B61FF", "#00B894", "#FFA726", "#FF6B6B", "#00C49F", "#FFBB28"];

const Analytics: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate=useNavigate()

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

  const columns = [
    
     { label: "ID", field: "id",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render:(row:any)=>`${row._id?.slice(0,6)
      }`
      },

    { label: "Product", field: "name",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render:(row:any)=>`${row.name}`
     },
   
    
    { label: "UpdateAt", field: "updatedAt" ,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render:(row:any)=>`${new Date(row.updatedAt).toLocaleDateString()}`
    },

  ];


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

     

{chartData.length > 0 && (
  <PaperWrapper
    sx={{
      overflowX: "auto",
      overflowY: "hidden",
      p: 2,
      mb:3,
       backgroundColor:'#222831',
      color:'white'
    }}
  >
    <Typography variant="h6" sx={{ mb: 2 }}>
      🧩 Category Breakdown
    </Typography>

    <Box
      sx={{
        height: isSm ? 300 : 400,
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
     
      }}
    >
      <ResponsiveContainer width={isSm ? "100%" : "90%"} height="100%">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={isSm ? 30 : 60}
            outerRadius={isSm ? 50 : 120}
            // paddingAngle={5}
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
  </PaperWrapper>
)}




      {/* Latest Products & Orders */}
      <Grid container spacing={2}>
        {/* Latest Products */}
        <Grid item xs={12} md={6}>
         
          <PaperWrapper sx={{ 
      }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Latest Users
          </Typography>
          <Divider sx={{ mt: 1 ,backgroundColor:'white'}} />

            {latestUsers.map((user) => (
              <Box key={user._id} sx={{ p: 2 ,color:'white' }} >
                <Typography variant="subtitle1" fontWeight="bold">
                  {user.name}
                </Typography>
                {user.email && (
                  <Typography variant="body2" color="text.secondary"  sx={{color:'white' }}>
                    {user.email}
                  </Typography>
                )}
                <Typography variant="caption" color="text.secondary"  sx={{color:'white' }}>
                  Updated At:{" "}
                  {new Date(user.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </Typography>
                <Divider sx={{ mt: 1 ,backgroundColor:'white'}} />
                </Box>
            ))}

<Box display="flex" alignItems="center" justifyContent="flex-end" mt={1}>
      <Typography>See more</Typography>
      <IconButton
        color="primary"
        onClick={() => {
          navigate('/admin/users')
        }}
        sx={{ borderRadius: 2 }}
      >
        <ArrowForwardIosIcon fontSize="small" />
      </IconButton>
    </Box>
          </PaperWrapper>
        </Grid>

        {/* Latest Orders */}
        <Grid item xs={12} md={6}>
  <PaperWrapper>
    <Typography variant="h5" sx={{ mb: 2 }}>
      Latest Products
    </Typography>
    
    <Divider sx={{ mt: 1, backgroundColor: 'white' }} />

    <ReusableTable columns={columns} rows={latestProducts} />

    <Box display="flex" alignItems="center" justifyContent="flex-end" mt={1}>
      <Typography>See more</Typography>
      <IconButton
        color="primary"
        onClick={() => {
          navigate('/admin/products')
        }}
        sx={{ borderRadius: 2 }}
      >
        <ArrowForwardIosIcon fontSize="small" />
      </IconButton>
    </Box>
  </PaperWrapper>
</Grid>

        
      </Grid>
    
    </Box>
    
  );
};

export default Analytics;
