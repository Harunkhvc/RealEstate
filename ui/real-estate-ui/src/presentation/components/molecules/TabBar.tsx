// src/presentation/components/molecules/TabBar.tsx
import AppTabs from "../atoms/AppTabs";
import AppTab from "../atoms/AppTab";

interface TabBarProps {
  value: number;
  onChange: (value: number) => void;
  tabs: { label: string }[];
}

export default function TabBar({ value, onChange, tabs }: TabBarProps) {
  return (
    <AppTabs value={value} onChange={(_, v) => onChange(v)}>
      {tabs.map((tab, i) => (
        <AppTab key={i} label={tab.label} />
      ))}
    </AppTabs>
  );
}
