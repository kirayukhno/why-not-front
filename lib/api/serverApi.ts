const BASE_URL = 'https://relax-map-back.onrender.com/api';

export const getLocationById = async (locationId: string) => {
  const response = await fetch(`${BASE_URL}/locations/${locationId}`, {
    cache: 'no-store',
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Не вдалося отримати локацію');
  }

  return data;
};