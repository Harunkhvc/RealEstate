import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

interface LikeButtonProps {
  liked: boolean;
  onClick: () => void;
}

export default function LikeButton({ liked, onClick }: LikeButtonProps) {
  return (
    <IconButton
      aria-label="Favorilere ekle"
      onClick={e => {
        e.stopPropagation();
        onClick();
      }}
      color={liked ? "error" : "default"}
      size="small"
    >
      {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
    </IconButton>
  );
}
