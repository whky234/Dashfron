import React from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useThemeContext } from "../../Context/usecontext";

const featuredProducts = [
  {
    name: "Diamond Ring",
    price: 2400,
    image: "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZHVjdHN8ZW58MHx8MHx8fDA%3D",
  },
  {
    name: "Luxury Earrings",
    price: 2400,
    image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cHJvZHVjdHN8ZW58MHx8MHx8fDA%3D",
  },
  {
    name: "Gold Bracelet",
    price: 2400,
    image: "https://plus.unsplash.com/premium_photo-1719289799376-d3de0ca4ddbc?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cHJvZHVjdHN8ZW58MHx8MHx8fDA%3D",
  },
];

const Homes: React.FC = () => {
  const navigate = useNavigate();
  const {theme}=useThemeContext()

  return (
    <Box sx={{ width: "100%" }}>
      {/* Hero Section */}
      <Box
        sx={{
          backgroundImage: `url('https://images.unsplash.com/photo-1625780289233-321883d99ac1?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: { xs: "40vh", sm: "50vh", md: "60vh" },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          px: { xs: 2, sm: 4, md: 5 },
          color: "#fff",
        }}
      >
        <Typography
          variant="h3"
          fontWeight="bold"
          sx={{ mb: 2, fontSize: { xs: "1.5rem", sm: "2.5rem", md: "3rem" } }}
        >
          A Million Sparkles for Just One You
        </Typography>
        <Typography
          variant="h6"
          sx={{ mb: 4, fontSize: { xs: "0.8rem", sm: "1rem", md: "1.25rem" } }}
        >
          Discover elegance in every detail with our stunning collection.
        </Typography>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#b71c1c",
            fontWeight: "bold",
            fontSize: { xs: "0.7rem", sm: "0.9rem", md: "1rem" },
          }}
          onClick={() => navigate("/products")}
        >
          Shop Now
        </Button>
      </Box>

      {/* Featured Products */}
      <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
        <Typography
          variant="h4"
          fontWeight="bold"
          textAlign="center"
          sx={{ mb: { xs: 2, sm: 3, md: 4 },color:theme==="dark"?"white":"black", fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" } }}
        >
          Featured Products
        </Typography>

        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
          {featuredProducts.map((product, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ boxShadow: 4, borderRadius: 2,
                backgroundColor:theme==="dark"?"#444":"white"
               }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={product.image}
                  alt={product.name}
                  sx={{ objectFit: "cover" }}
                />
                <CardContent sx={{ textAlign: "center",color:theme==="dark"?"white":"black" }}>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    sx={{ fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" } }}
                  >
                    {product.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ my: 1, fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1rem" } }}
                  >
                    ${product.price}
                  </Typography>
                  <Button
                    size="small"
                    variant="contained"
                    sx={{
                      backgroundColor: "#d32f2f",
                      fontWeight: "bold",
                      fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.9rem" },
                      "&:hover": {
                        backgroundColor: "#b71c1c",
                      },
                    }}
                    onClick={() => navigate("/user/product")}
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
