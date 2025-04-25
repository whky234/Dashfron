import React from "react";
import { Box, Typography, Button, Grid, Card, CardMedia, CardContent } from "@mui/material";
import { useNavigate } from "react-router-dom";

const featuredProducts = [
  {
    name: "Diamond Ring",
    price: 2400,
    image: "https://via.placeholder.com/300x200?text=Diamond+Ring",
  },
  {
    name: "Luxury Earrings",
    price: 2400,
    image: "https://via.placeholder.com/300x200?text=Luxury+Earrings",
  },
  {
    name: "Gold Bracelet",
    price: 2400,
    image: "https://via.placeholder.com/300x200?text=Gold+Bracelet",
  },
];

const Homes: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ width: "100%" }}>
      {/* Hero Section */}
      <Box
        sx={{
          backgroundImage: `url('https://images.unsplash.com/photo-1625780289233-321883d99ac1?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "60vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          px: 5,
          color: "#fff",
        //   width: "100%",
        }}
      >
        <Typography variant="h3" fontWeight="bold" sx={{ mb: 2 }}>
          A Million Sparkles for Just One You
        </Typography>
        <Typography variant="h6" sx={{ mb: 4 }}>
          Discover elegance in every detail with our stunning collection.
        </Typography>
        <Button
          variant="contained"
          sx={{ backgroundColor: "#b71c1c", fontWeight: "bold" }}
          onClick={() => navigate("/products")}
        >
          Shop Now
        </Button>
      </Box>

      {/* Featured Products */}
      <Box sx={{ p: 4}}>
        <Typography variant="h4" fontWeight="bold" textAlign="center" sx={{ mb: 4 }}>
          Featured Products
        </Typography>

        <Grid container spacing={4}>
          {featuredProducts.map((product, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ boxShadow: 4, borderRadius: 2 }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={product.image}
                  alt={product.name}
                />
                <CardContent sx={{ textAlign: "center" }}>
                  <Typography variant="h6" fontWeight="bold">
                    {product.name}
                  </Typography>
                  <Typography variant="body2" sx={{ my: 1 }}>
                    ${product.price}
                  </Typography>
                  <Button
                    size="small"
                    variant="contained"
                    sx={{
                      backgroundColor: "#d32f2f",
                      fontWeight: "bold",
                      "&:hover": {
                        backgroundColor: "#b71c1c",
                      },
                    }}
                    onClick={() => navigate("/products")}
                  >
                    View Product
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Homes;
