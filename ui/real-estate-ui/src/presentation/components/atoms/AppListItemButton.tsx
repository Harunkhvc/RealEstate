// src/presentation/components/atoms/AppListItemButton.tsx
import { ListItem, ListItemButton, ListItemText } from "@mui/material";

interface Props {
  text: string;
  onClick?: () => void;
}

export default function AppListItemButton({ text, onClick }: Props) {
  return (
    <ListItem disablePadding>
      <ListItemButton sx={{ pl: 2 }} onClick={onClick}>
        <ListItemText primary={text} />
      </ListItemButton>
    </ListItem>
  );
}
