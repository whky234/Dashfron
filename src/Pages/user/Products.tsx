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
import { useThemeContext } from "../../Context/usecontext";

const Product: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading, error } = useSelector((state: RootState) => state.product);
    const {theme}=useThemeContext()
  

  useEffect(() => {
    dispatch(fetchproduct());
  }, [dispatch]);

  if (loading) return <CircularProgress sx={{ display: "block", mx: "auto", mt: 5 }} />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ px: { xs: 2, sm: 3, md: 5 }, py: 5, backgroundColor:theme==="dark"?"black":"#fff" }}>
      <Typography
        variant="h4"
        sx={{
          mb: 4,
          textAlign: "center",
          fontWeight: "bold",
          color: "#b71c1c",
          textTransform: "uppercase",
          fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
        }}
      >
        A Million Sparkles for Just One You
      </Typography>

      <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product._id}>
            <Card
              sx={{
                boxShadow: 5,
                borderRadius: 2,
                transition: "transform 0.3s",
                "&:hover": {
                  transform: "scale(1.05)",
                },
                backgroundColor:theme==="dark"?"#444":"#fff",
              }}
            >
              <CardMedia
                component="img"
                height="240"
                image={product.image}
                alt={product.name}
                sx={{ objectFit: "cover" }}
              />
             <CardContent sx={{ textAlign: "center",color:theme==="dark"?"white":"black",
 }}>
  <Typography
    variant="h6"
    sx={{ fontWeight: "bold", fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" } }}
  >
    {product.name}
  </Typography>

  {/* Size Selection */}
  

  {/* Price and Add to Cart */}
  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 3 }}>
    <Typography variant="h6" sx={{ fontWeight: "bold", color: "#000" }}>
      ${product.price}
    </Typography>
    <Button
      variant="contained"
      sx={{
        backgroundColor: "#000",
        fontWeight: "bold",
        textTransform: "none",
        px: 2,
        py: 1,
        fontSize: "0.85rem",
        "&:hover": { backgroundColor: "#333" },
      }}
    >
      🛒 Add to cart
    </Button>
  </Box>
</CardContent>

            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Product;
