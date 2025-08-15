// src/presentation/components/molecules/StringListTable.tsx
import { Table, TableBody, TableCell, TableRow, Button } from "@mui/material";

interface Props {
  items: string[];
  onDelete: (value: string) => void;
  addButtonText: string;
  onAddClick: () => void;
}

export default function StringListTable({ items, onDelete, addButtonText, onAddClick }: Props) {
  return (
    <Table size="small">
      <TableBody>
        {items.map((v, i) => (
          <TableRow key={i}>
            <TableCell>{v}</TableCell>
            <TableCell align="right">
              <Button color="error" size="small" onClick={() => onDelete(v)}>
                Sil
              </Button>
            </TableCell>
          </TableRow>
        ))}
        <TableRow>
          <TableCell colSpan={2}>
            <Button variant="outlined" size="small" onClick={onAddClick}>
              + {addButtonText}
            </Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
