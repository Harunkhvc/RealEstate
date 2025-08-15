import { TextField } from "@mui/material";
import type { TextFieldProps } from "@mui/material";

export default function AppTextField(props: TextFieldProps) {
  return (
    <TextField
      size="small"
      variant="outlined"
      sx={{
        "& .MuiOutlinedInput-root": { borderRadius: 2.5 },
        "& label": { color: "#b71c1c" },
        ...props.sx,
      }}
      InputProps={{ sx: { fontWeight: 500 }, ...props.InputProps }}
      {...props}
    />
  );
}
