// src/presentation/components/atoms/TableHeaderCell.tsx
import { TableCell } from "@mui/material";
import type { TableCellProps } from "@mui/material";

export default function TableHeaderCell(props: TableCellProps) {
  return (
    <TableCell
      sx={{
        color: "#90caf9",
        fontWeight: 800,
        fontSize: 15,
        letterSpacing: 0.2,
        borderBottom: "2.5px solid #29304b",
        py: 2,
        ...props.sx,
      }}
      {...props}
    />
  );
}
