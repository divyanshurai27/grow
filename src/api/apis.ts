import axios from "axios";

export const fetchapis = async (page: number, limit: number) => {
  const response = await axios.get(
    `https://api.artic.edu/api/v1/artworks?page=${page}&limit=${limit}`
  );

  return response.data;
};