// src/presentation/components/organisms/PropertyTable.tsx
import { Paper, Table, TableHead, TableRow, TableBody } from "@mui/material";
import TableHeaderCell from "../atoms/TableHeaderCell";
import PropertyTableRowItem from "../molecules/PropertyTableRowItem";
import type { PropertyTableRow } from "../../../shared/types/property";
import { useTranslation } from "react-i18next";

interface PropertyTableProps {
  properties: PropertyTableRow[];
  onEdit: (row: PropertyTableRow) => void;
  onDelete: (id: number) => void;
}

export default function PropertyTable({ properties, onEdit, onDelete }: PropertyTableProps) {
  const { t } = useTranslation();

  return (
    <Paper
      elevation={3}
      sx={{
        bgcolor: "#272A45",
        borderRadius: 3,
        boxShadow: "0 4px 32px 0 #10152d22",
        overflow: "hidden",
        mt: 1,
      }}
    >
      <Table sx={{ minWidth: 760 }}>
        <TableHead>
          <TableRow sx={{ bgcolor: "#232b44" }}>
            <TableHeaderCell>{t("propertyTable.photo", "Foto")}</TableHeaderCell>
            <TableHeaderCell>{t("propertyTable.title", "Başlık")}</TableHeaderCell>
            <TableHeaderCell>{t("propertyTable.type", "Tip")}</TableHeaderCell>
            <TableHeaderCell>{t("propertyTable.status", "Durum")}</TableHeaderCell>
            <TableHeaderCell>{t("propertyTable.price", "Fiyat")}</TableHeaderCell>
            <TableHeaderCell>{t("propertyTable.date", "Tarih")}</TableHeaderCell>
            <TableHeaderCell align="right">{t("propertyTable.actions", "İşlemler")}</TableHeaderCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {properties.map((p, i) => (
            <PropertyTableRowItem
              key={p.id}
              row={p}
              index={i}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
