// src/presentation/components/molecules/CoordinatesFields.tsx
import { Stack } from "@mui/material";
import AppTextField from "../atoms/AppTextField";

interface Props {
  latitude: string;
  longitude: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function CoordinatesFields({ latitude, longitude, onChange }: Props) {
  return (
    <Stack direction="row" spacing={2}>
      <AppTextField
        label="Enlem"
        name="latitude"
        type="number"
        value={latitude}
        onChange={onChange}
        sx={{ minWidth: 120 }}
        InputProps={{ inputProps: { step: "any" } }}
      />
      <AppTextField
        label="Boylam"
        name="longitude"
        type="number"
        value={longitude}
        onChange={onChange}
        sx={{ minWidth: 120 }}
        InputProps={{ inputProps: { step: "any" } }}
      />
    </Stack>
  );
}
