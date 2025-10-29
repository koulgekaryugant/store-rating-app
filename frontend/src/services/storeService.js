import api from './api';

export const getStores = async () => {
  const res = await api.get('/stores');
  return res.data;
};

export const submitRating = async (storeId, ratingValue) => {
  const res = await api.post(`/stores/rate/${storeId}`, { ratingValue });
  return res.data;
};
