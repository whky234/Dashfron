import axios from "axios";
import { isAdmin } from "./IsAdmin";

const Api_Url = "http://localhost:3000/api/auth";

export const registeruser = async (userData: {
  name: string;
  email: string;
  password: string;
  role: string;
}) => {
  const response = await axios.post(`${Api_Url}/register`, userData);
  return response.data;
};

export const loginuser = async (credentials: {
  email: string;
  password: string;
}) => {
  const response = await axios.post(`${Api_Url}/login`, credentials);
  return response.data;
};

export const newpassword = async (credentials: {
  currentPassword: string;
  newPassword: string;
}) => {
  const response = await axios.post(`${Api_Url}/new-password`, credentials, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return response.data;
};

export const getCurrent = async () => {
  const response = await axios.get(`${Api_Url}/current`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  return response.data;
};

export const getusers = async () => {
  if (!isAdmin) {
    throw new Error("Access denied. Admin privileges required.");
  }
  const response = await axios.get(`${Api_Url}/getUsers`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  return response.data;
};

export const deleteuser = async (id: string) => {
  if (!isAdmin) {
    throw new Error("Access denied. Admin privileges required.");
  }
  const response = await axios.delete(`${Api_Url}/delete/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  return response.data;
};

export const edituser = async (
  id: string,
  userData: { name: string; email: string; role: string; status: string }
) => {
  if (!isAdmin) {
    throw new Error("Access denied. Admin privileges required.");
  }
  const response = await axios.put(`${Api_Url}/Edit/${id}`, userData, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  return response.data;
};

export const adduser = async (userData: {
  name: string;
  email: string;
  role: string;
}) => {
  if (!isAdmin) {
    throw new Error("Access denied. Admin privileges required.");
  }
  const response = await axios.post(`${Api_Url}/AddUser`, userData, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  return response.data;
};

export const changerole = async (id: string, role: string) => {
  if (!isAdmin) {
    throw new Error("Access denied. Admin privileges required.");
  }
  const response = await axios.put(
    `${Api_Url}/EditRole/${id}`,
    { role },
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );

  return response.data;
};

export const changestatus = async (id: string, status: string) => {
  if (!isAdmin) {
    throw new Error("Access denied. Admin privileges required.");
  }
  const response = await axios.put(
    `${Api_Url}/Status/${id}`,
    { status },
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );

  return response.data;
};
