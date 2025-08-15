// src/presentation/components/atoms/SearchInput.tsx
import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  size?: "small" | "medium";
  background?: string;
}

export default function SearchInput({
  value,
  onChange,
  placeholder = "Ara...",
  size = "small",
  background = "#f7f8fa",
}: SearchInputProps) {
  return (
    <TextField
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      sx={{ flex: 1, background }}
      size={size}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon color="disabled" />
          </InputAdornment>
        ),
      }}
    />
  );
}
