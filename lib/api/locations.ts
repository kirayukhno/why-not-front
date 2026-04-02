export const createLocation = async (formData: FormData) => {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const response = await fetch(
    'https://relax-map-back.onrender.com/api/locations',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Не вдалося створити локацію');
  }

  return data;
};

export const getLocationById = async (locationId: string) => {
  const response = await fetch(
    `https://relax-map-back.onrender.com/api/locations/${locationId}`,
    {
      cache: 'no-store',
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Не вдалося отримати локацію');
  }

  return data;
};

export const updateLocation = async (
  locationId: string,
  formData: FormData
) => {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const response = await fetch(
    `https://relax-map-back.onrender.com/api/locations/${locationId}`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Не вдалося оновити локацію');
  }

  return data;
};