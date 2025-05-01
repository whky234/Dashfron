
import { TextField,TextFieldProps } from "@mui/material"
const Whitetextfield:React.FC<TextFieldProps>=(props)=>{

    return <TextField
        {...props}
        InputLabelProps={{ style: { color: 'white' }}}
        InputProps={{ style: { color: 'white' } }}
        sx={{
            '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'white' },
                '&:hover fieldset': { borderColor: '#90caf9' },
                '&.Mui-focused fieldset': { borderColor: '#42a5f5' },
            },
            ...(props.sx || {}),
        }} />

}

export default Whitetextfield