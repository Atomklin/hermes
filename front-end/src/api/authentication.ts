import axios from "axios";

import { getLanguageCode } from "./utils";

export async function login(username: string, password: string) {
  if (!username.length || !password.length)
    throw Error("Username and Password is required");

  const { status } = await axios.post("/api/auth/login", 
    { username, password }, 
    { withCredentials: true });

  if (status !== 200) {
    throw Error("Invalid username / password");

  } else {
    const language = getLanguageCode();
    window.location.pathname = "/" + language + "/dashboard";
  }
}

export async function logout() {
  const { status } = await axios.post("/api/auth/logout", 
    {}, { withCredentials: true });

  if (status !== 200) {
    throw Error("A server error occurred while trying to log out");

  } else {
    const language = getLanguageCode();
    window.location.pathname = "/" + language + "/login";
  }
}