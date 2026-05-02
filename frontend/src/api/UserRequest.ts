import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/user/",
});

// Get all users
export const getUsers = () =>
  API.get("get", {
    headers: {
      "Content-Type": "application/json",
    },
  });

// Get user by ID
export const getUserById = (id: any) =>
  API.get("get/" + id, {
    headers: {
      "Content-Type": "application/json",
    },
  });

// Get users by school ID (if applicable)
export const getUsersBySchoolId = (id: any) =>
  API.get("get_by_school/" + id, {
    headers: {
      "Content-Type": "application/json",
    },
  });

// Create user
export const createUser = (formdata: any) =>
  API.post("post", formdata, {
    headers: {
      "Content-Type": "application/json",
    },
  });

// Update user
export const updateUser = (formdata: any) =>
  API.post("put", formdata, {
    headers: {
      "Content-Type": "application/json",
    },
  });

// Delete user
export const deleteUser = (formdata: any) =>
  API.post("delete", formdata, {
    headers: {
      "Content-Type": "application/json",
    },
  });