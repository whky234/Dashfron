import React from "react";
import { Box, Grid, Typography, Button } from "@mui/material";
import { useThemeContext } from "../../Context/usecontext";

const About: React.FC = () => {

   const {theme,toggletheme}=useThemeContext()
  
  return (
    <Box sx={{ px: { xs: 2, sm: 4, md: 8 }, py: 6, backgroundColor:theme==="dark"?"black":"#fff" }}>
      <Grid container spacing={4} alignItems="center">
        <Grid item xs={12} md={6}>
          <Box
            component="img"
            src="https://images.unsplash.com/photo-1523275335684-37898b6baf30"
            alt="About Us"
            sx={{
              width: "100%",
              borderRadius: 3,
              boxShadow: 4,
              objectFit: "cover",
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography
            variant="h4"
            sx={{ fontWeight: "bold", mb: 2, color: "#d32f2f" }}
          >
            About Our Store
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, color:theme==="dark"?"white":"text.secondary" }}>
            We are more than just a shopping site — we're your go-to destination
            for premium quality, trending fashion, and unbeatable customer
            experience. Since our launch, we've delivered smiles to thousands
            of happy customers across the globe.
            <br />
            <br />
            Our mission is to bring the best products directly to your doorstep
            with reliability, speed, and care.
          </Typography>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#d32f2f",
              "&:hover": { backgroundColor: "#b71c1c" },
              fontWeight: "bold",
            }}
          >
            Shop Now
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default About;
