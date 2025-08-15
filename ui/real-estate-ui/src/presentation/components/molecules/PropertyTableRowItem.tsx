// src/presentation/components/molecules/PropertyTableRowItem.tsx
import { TableRow, TableCell, Box } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PropertyAvatar from "../atoms/PropertyAvatar";
import ActionIconButton from "../atoms/ActionIconButton";
import type { PropertyTableRow } from "../../../shared/types/property";
import { useTranslation } from "react-i18next";

function formatDate(dateStr?: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr.substring(0, 10);
  return d.toLocaleDateString("tr-TR");
}

interface Props {
  row: PropertyTableRow;
  index: number;
  onEdit: (row: PropertyTableRow) => void;
  onDelete: (id: number) => void;
}

export default function PropertyTableRowItem({ row, index, onEdit, onDelete }: Props) {
  const { t } = useTranslation();

  return (
    <TableRow
      sx={{
        bgcolor: index % 2 === 0 ? "#25273D" : "#222437",
        "&:hover": { bgcolor: "#283055" },
        transition: "background 0.18s",
      }}
    >
      <TableCell><PropertyAvatar src={row.thumbnailUrl} /></TableCell>

      <TableCell>
        <Box sx={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>{row.title}</Box>
      </TableCell>

      <TableCell>
        <Box sx={{ color: "#a4e3fc", fontWeight: 600 }}>{row.propertyType}</Box>
      </TableCell>

      <TableCell>
        <Box sx={{ color: "#ffd700", fontWeight: 700, letterSpacing: 0.5 }}>
          {row.propertyStatus}
        </Box>
      </TableCell>

      <TableCell>
        <Box sx={{ color: "#fff", fontWeight: 700 }}>
          {row.price} <Box component="span" sx={{ color: "#a4e3fc" }}>{row.currency}</Box>
        </Box>
      </TableCell>

      <TableCell>
        <Box sx={{ color: "#fff", fontSize: 14 }}>
          {formatDate(row.startDate)}
          <br />
          <Box component="span" sx={{ color: "#a2a8cc", fontWeight: 400 }}>
            {formatDate(row.endDate)}
          </Box>
        </Box>
      </TableCell>

      <TableCell align="right">
        <ActionIconButton
          title={t("propertyTable.edit", "Düzenle")}
          icon={<EditIcon />}
          onClick={() => onEdit(row)}
          mr={0.5}
        />
        <ActionIconButton
          title={t("propertyTable.delete", "Sil")}
          icon={<DeleteIcon />}
          onClick={() => onDelete(row.id)}
          color="#ff6b81"
          hoverColor="#fff"
          hoverBg="#b61827"
        />
      </TableCell>
    </TableRow>
  );
}
