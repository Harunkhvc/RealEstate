// src/presentation/components/molecules/SearchBar.tsx
import SelectField from "../atoms/SelectField";
import SearchInput from "../atoms/SearchInput";
import AppButton from "../atoms/AppButton";
import { useTranslation } from "react-i18next";

interface SearchBarProps {
  type: string;
  onTypeChange: (type: string) => void;
  query: string;
  onQueryChange: (query: string) => void;
  types: string[];
  onSearch: () => void;
}

export default function SearchBar({
  type,
  onTypeChange,
  query,
  onQueryChange,
  types,
  onSearch,
}: SearchBarProps) {
  const { t } = useTranslation();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSearch();
      }}
      style={{ display: "flex", gap: 16 }}
    >
      <SelectField value={type} onChange={onTypeChange} options={types} />
      <SearchInput
        value={query}
        onChange={onQueryChange}
        placeholder={t(
          "searchBar.placeholder",
          "Konum, ilan no ya da firma adıyla arayın"
        )}
      />
      <AppButton
        type="submit"
        variant="contained"
        size="large"
        sx={{ px: 4, fontWeight: 600, fontSize: 18 }}
        color="primary"
        label={t("searchBar.search", "Ara")}
      />
    </form>
  );
}
