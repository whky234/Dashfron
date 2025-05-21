import React, { useState } from "react";
import { Box, Grid, Typography, Card, CardContent } from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import SecurityIcon from "@mui/icons-material/Security";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import { useThemeContext } from "../../Context/usecontext";

// type Person={
//   name: string;
//   gift?:string
// }

// const initialgift=[`bag`,`shoes`, `watch`,`phone`,`laptop`]
const services = [
  {
    title: "Fast Delivery",
    description: "Get your products delivered in 1-2 business days.",
    icon: <LocalShippingIcon sx={{ fontSize: 40, color: "#d32f2f" }} />,
  },
  {
    title: "24/7 Support",
    description: "Our support team is available anytime you need help.",
    icon: <SupportAgentIcon sx={{ fontSize: 40, color: "#d32f2f" }} />,
  },
  {
    title: "Secure Payments",
    description: "Your payments are processed with full encryption.",
    icon: <SecurityIcon sx={{ fontSize: 40, color: "#d32f2f" }} />,
  },
  {
    title: "Easy Returns",
    description: "Not satisfied? Return your product within 7 days.",
    icon: <AutorenewIcon sx={{ fontSize: 40, color: "#d32f2f" }} />,
  },
];

const Services: React.FC = () => {
//  const [person,setPerson]=useState<Person[]>([]);
//  const [inputValue, setInputValue] = useState<string>("");

 const {theme,toggletheme}=useThemeContext()

//  const Addperson=()=>{
//   if(inputValue.trim() && !person.find(p=>p.name===inputValue))
//     setPerson([...person,{name:inputValue.trim()}])
//  }

//  const Assigngifts=()=>{
//   const shuffle=[...initialgift,].sort(()=>Math.random()-0.5)
//   .slice(0,person.length);

// const update=person.map((p,index)=>{
//   return {...p,gift:shuffle[index]}
// });

// setPerson(update)
//  }


//  const resetgift=()=>{
//   setPerson(person.map(p=>({...p,gift:undefined})))
//   setInputValue("")
//  }


  return (
    <Box sx={{ px: { xs: 2, sm: 4, md: 8 }, py: 6,backgroundColor: theme === "dark" ? "black" : "#fff" }}>
{/* 
      <input type="text"  value={inputValue} onChange={(e)=>setInputValue(e.target.value)} />
      <button onClick={Addperson}>Add</button>
      <button onClick={Assigngifts} disabled={person.length===0}>Assign Gifts</button>
      <button onClick={resetgift} disabled={person.length===0}>Reset Gifts</button>
      <ul>
        {person.map((p,index)=><li key={index}>{p.name} {p.gift}</li>)}
      </ul>
      <p>Current theme: {theme}</p>
      <button onClick={toggletheme}>Toggle Theme</button> */}

      <Typography
        variant="h4"
        sx={{
          textAlign: "center",
          fontWeight: "bold",
          mb: 5,
          color: theme==="dark"?"white":"#333",
          textTransform: "uppercase",
        }}
      >
        Our Services
      </Typography>
      <Grid container spacing={4}>
        {services.map((service, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                textAlign: "center",
                boxShadow: 4,
                borderRadius: 2,
                py: 4,
                px: 2,
                transition: "transform 0.3s",
                "&:hover": { transform: "translateY(-5px)" },
                backgroundColor:theme==="dark"?"#444":"white"
              }}
            >
              <Box>{service.icon}</Box>
              <CardContent sx={{color:theme==="dark"?"white":"black"}}>
                <Typography variant="h6" sx={{ fontWeight: "bold", mt: 2 }}>
                  {service.title}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, color: "text.secondary" }}>
                  {service.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Services;
