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
  Button,
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
    <Box sx={{ px: 3, py: 5, backgroundColor: "#f5f5f5" }}>
      <Typography
        variant="h4"
        sx={{
          mb: 4,
          textAlign: "center",
          fontWeight: "bold",
          color: "#b71c1c",
          textTransform: "uppercase",
        }}
      >
        A Million Sparkles for Just One You
      </Typography>

      <Grid container spacing={4}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product._id}>
            <Card
              sx={{
                boxShadow: 5,
                borderRadius: 2,
                transition: "transform 0.3s",
                "&:hover": {
                  transform: "scale(1.03)",
                },
                backgroundColor: "#fff",
              }}
            >
              <CardMedia
                component="img"
                height="240"
                image={product.image}
                alt={product.name}
                sx={{ objectFit: "cover" }}
              />
              <CardContent sx={{ textAlign: "center" }}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {product.name}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1, mb: 2 }}
                >
                  {product.description || "Elegant diamond-studded design"}
                </Typography>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#d32f2f",
                    color: "#fff",
                    fontWeight: "bold",
                    px: 4,
                    borderRadius: 0,
                    "&:hover": {
                      backgroundColor: "#b71c1c",
                    },
                  }}
                >
                  ${product.price}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Product;
