import React from "react";
// import SideNav from "./admin/sidenave";
import { Box, CssBaseline, Toolbar } from "@mui/material";
import { Outlet } from "react-router-dom";



export const Admin:React.FC=()=>{

    return(
        <Box sx={{ display: "flex" }}>
        <CssBaseline />
        
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar /> {/* Adds spacing for the AppBar */}
          <Outlet /> {/* Renders nested routes */}
        </Box>
      </Box>
    )
}