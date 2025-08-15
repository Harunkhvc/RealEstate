// src/presentation/components/atoms/PropertyAvatar.tsx
import { Avatar } from "@mui/material";

export default function PropertyAvatar({ src }: { src?: string }) {
  return (
    <Avatar
      src={src}
      variant="rounded"
      sx={{
        width: 56,
        height: 38,
        borderRadius: 2.5,
        boxShadow: "0 2px 8px 0 #0003",
        bgcolor: "#191a23",
      }}
    />
  );
}
