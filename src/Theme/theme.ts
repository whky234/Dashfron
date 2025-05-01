// theme.ts
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1e88e5", // Blue
    },
    secondary: {
      main: "#d81b60", // Pink
    },
    success: {
      main: "#43a047", // Green
    },
    warning: {
      main: "#fb8c00", // Orange
    },
    background: {
      default: "#393E46", // Optional background color
    },
  },
});

export default theme;
