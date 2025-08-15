import axios from "../http/axiosInstance";

export interface PropertyListItem {
  id: number;
  title: string;
  price: number;
  location?: string;
  image?: string; // backend'deki ilk foto alanına map'lersin
  
}

export async function toggleFavorite(propertyId: number): Promise<{ added: boolean }> {
  const { data } = await axios.post(`/favorites/${propertyId}/toggle`);
  return data; // { added: boolean }
}

export async function getFavoriteIds(): Promise<number[]> {
  const { data } = await axios.get(`/favorites/ids`);
  return data as number[];
}

export async function getFavoriteProperties(): Promise<PropertyListItem[]> {
  const { data } = await axios.get(`/favorites`);
  // data -> backend'de PropertyListDto[]. Eğer alan adların farklıysa burada map'le.
  return data as PropertyListItem[];
}
