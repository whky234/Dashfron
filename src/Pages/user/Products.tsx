/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  CircularProgress,
  Grid,
} from "@mui/material";
import { fetchproduct } from "../../stores/features/productslice";
import { AppDispatch, RootState } from "../../stores/store";

const Product: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading, error } = useSelector((state: RootState) => state.product);

  useEffect(() => {
    dispatch(fetchproduct());
  }, [dispatch]);

  if (loading) return <CircularProgress sx={{ display: "block", mx: "auto", mt: 5 }} />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, textAlign: "center" }}>
        Product List
      </Typography>

      <Grid container spacing={3} >
  {products.map((product) => (
    <Grid item xs={12} sm={6} md={4} lg={4} key={product._id}>
      <Card sx={{ width: '100%', boxShadow: 3, borderRadius: 2 }}>
        <CardMedia
          component="img"
          height="200"
          image={product.image }
          alt={product.name}
        />
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: "bold", textAlign: "center" }}>
            {product.name}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ textAlign: "center" }}>
            ${product.price}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  ))}
</Grid>

    </Box>
  );
};

export default Product;
