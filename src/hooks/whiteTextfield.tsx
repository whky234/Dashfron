import React from 'react';
import { TextField, TextFieldProps } from "@mui/material";

const Whitetextfield: React.FC<TextFieldProps> = (props) => {
  const { label, name, ...rest } = props;

  const testId = name
    ? `textfield-${name}`
    : label
    ? `textfield-${String(label).replace(/\s+/g, "").toLowerCase()}`
    : undefined;

  return (
    <TextField
      {...rest}
      label={label}
      name={name}
      data-testid={testId}
      InputLabelProps={{ style: { color: 'white' } }}
      InputProps={{
        style: { color: 'white' },
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          '& fieldset': { borderColor: 'white' },
          '&:hover fieldset': { borderColor: '#90caf9' },
          '&.Mui-focused ': { borderColor: '#42a5f5' },
        },
        ...(props.sx || {}),
      }}
    />
  );
};

export default Whitetextfield;
