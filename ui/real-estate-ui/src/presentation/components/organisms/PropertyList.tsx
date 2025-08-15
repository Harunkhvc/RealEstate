import PropertyCard from "../molecules/PropertyCard";


interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  image: string;
}

interface PropertyListProps {
  properties: Property[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

export default function PropertyList({ properties, favorites, onToggleFavorite }: PropertyListProps) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "24px",
        justifyContent: "flex-start",
      }}
    >
      {properties.map((property) => (
        <div
          key={property.id}
          style={{
            flex: "0 1 320px",
            maxWidth: 400,
            minWidth: 260,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <PropertyCard
            {...property}
            isFavorite={favorites.includes(property.id)}
            onToggleFavorite={() => onToggleFavorite(property.id)}
          />
        </div>
      ))}
    </div>
  );
}
