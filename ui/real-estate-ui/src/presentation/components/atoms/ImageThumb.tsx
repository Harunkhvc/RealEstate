import { Avatar } from "@mui/material";

export default function ImageThumb({
  src,
  alt,
  active,
  onClick,
}: {
  src: string;
  alt: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <Avatar
      src={src}
      alt={alt}
      variant="rounded"
      sx={{
        width: 62,
        height: 44,
        border: active ? "2.5px solid #1565c0" : "1px solid #e0e0e0",
        boxShadow: active ? "0 4px 14px #1565c04a" : "",
        cursor: "pointer",
        mx: 0.25,
      }}
      imgProps={{ loading: "lazy" }}
      onClick={onClick}
    />
  );
}
