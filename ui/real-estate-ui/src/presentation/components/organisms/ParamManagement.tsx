// src/presentation/components/organisms/ParamManagement.tsx
import { useState } from "react";
import { Box, Typography } from "@mui/material";
import StringListTable from "../molecules/StringListTable";
import AddStringDialog from "../molecules/AddStringDialog";
import { useTranslation } from "react-i18next";

const INITIAL_PARAMS = {
  types: ["Villa", "Daire", "Arsa"],
  statuses: ["Satılık", "Kiralık"],
  currencies: ["TL", "USD", "EUR"],
};

type ParamKey = "types" | "statuses" | "currencies";

interface ParamManagementProps {
  tabKey: ParamKey;
}

export default function ParamManagement({ tabKey }: ParamManagementProps) {
  const { t } = useTranslation();
  const [params, setParams] = useState(INITIAL_PARAMS);
  const [dialogOpen, setDialogOpen] = useState(false);

  const values = params[tabKey];

  const openDialog = () => setDialogOpen(true);
  const closeDialog = () => setDialogOpen(false);

  const handleAdd = (val: string) => {
    setParams((p) => ({ ...p, [tabKey]: [...p[tabKey], val] }));
  };

  const handleDelete = (value: string) => {
    setParams((p) => ({ ...p, [tabKey]: p[tabKey].filter((v) => v !== value) }));
  };

  // i18n başlık ve buton etiketleri
  const title = t(`param.titles.${tabKey}`, {
    defaultValue:
      tabKey === "types" ? "Emlak Tipleri" :
      tabKey === "statuses" ? "Emlak Durumları" :
      "Döviz Türleri",
  });

  const addLabel = t(`param.add.${tabKey}`, {
    defaultValue:
      tabKey === "types" ? "Tip Ekle" :
      tabKey === "statuses" ? "Durum Ekle" :
      "Döviz Ekle",
  });

  return (
    <Box maxWidth={420} mx="auto">
      <Typography variant="h6" fontWeight={700} mb={2}>
        {title}
      </Typography>

      <StringListTable
        items={values}
        onDelete={handleDelete}
        addButtonText={addLabel}
        onAddClick={openDialog}
      />

      <AddStringDialog
        open={dialogOpen}
        title={addLabel}
        onClose={closeDialog}
        onAdd={handleAdd}
      />
    </Box>
  );
}
