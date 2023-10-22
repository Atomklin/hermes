import axios from "axios";

export async function login(username: string, password: string) {
  return axios.post("/api/auth/login", { username, password });
}

export async function logout() {
  return axios.post("/api/auth/logout", {}, { withCredentials: true });
}