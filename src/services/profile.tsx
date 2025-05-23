import axios from 'axios';

const API_URL = 'http://localhost:3000/api/profile';
// const API_URL  = "https://dashboardproducts-ff5e09c8bf17.herokuapp.com/api/profile";

export interface Profile {
    userId?: string;
    username?: string;
    profilePicture?: string;
    phone?: string;
    bio?: string;
    location?: string;
    dateOfBirth?: string; // ISO string
    gender?: 'male' | 'female' | 'other';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  }
  

export const getProfile = async () => {
  const response = await axios.get(`${API_URL}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },

  });
  return response.data;
};

export const updateProfile = async (profileData: Profile) => {
  const response = await axios.put(`${API_URL}/add`, profileData, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },

  });
  return response.data;
};
