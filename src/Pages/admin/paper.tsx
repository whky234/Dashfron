import { Paper, PaperProps } from "@mui/material";

type PaperWrapperProps = PaperProps & {
  children: React.ReactNode;
};

const PaperWrapper: React.FC<PaperWrapperProps> = ({ children, ...props }) => {
  return (
    <Paper
      {...props}
      sx={{
        // width: "100%",
        backgroundColor: "#222831", // Dark background
        color: "#EEEEEE",            // Light text
        ...props.sx,                 // Allow override
      }}
    >
      {children}
    </Paper>
  );
};

export default PaperWrapper;
