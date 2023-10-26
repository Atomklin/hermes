import axios from "axios";

import { regiment, user } from "./globals";

export async function login(username: string, password: string) {
  if (!username.length || !password.length)
    throw Error("Username and Password is required");

  await axios.post("/api/auth/login", 
    { username, password }, 
    { withCredentials: true });

  const { data: userData } = 
    await axios.get("/api/auth/userinfo", { withCredentials: true });

  const { data: regimentData } = 
    await axios.get("/api/regiments/current", { withCredentials: true });
    
  user.set(userData);
  regiment.set(regimentData 
    ? regimentData 
    : undefined);

  window.location.pathname = "/" + userData.language + "/regiments";
}

export async function logout() {
  user.set(undefined);
  regiment.set(undefined);

  const { status } = await axios.post("/api/auth/logout", 
    {}, { withCredentials: true });

  if (status !== 200)
    throw Error("A server error occurred while trying to log out");
  
  window.location.pathname = "/";
}