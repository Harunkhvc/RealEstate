// src/presentation/components/molecules/AddStringDialog.tsx
import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import AppTextField from "../atoms/AppTextField";
import AppButton from "../atoms/AppButton";
import { useState, useEffect } from "react";

interface Props {
  open: boolean;
  title: string;
  label?: string;
  onClose: () => void;
  onAdd: (value: string) => void;
}

export default function AddStringDialog({ open, title, label = "Değer", onClose, onAdd }: Props) {
  const [value, setValue] = useState("");

  useEffect(() => {
    if (!open) setValue("");
  }, [open]);

  const submit = () => {
    if (!value.trim()) return;
    onAdd(value.trim());
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <AppTextField
          label={label}
          fullWidth
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              submit();
            }
          }}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <AppButton variant="text" onClick={onClose} label="İptal" />
        <AppButton variant="contained" onClick={submit} label="Ekle" />
      </DialogActions>
    </Dialog>
  );
}
