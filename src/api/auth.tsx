import axios from "./axios";

export function login(email: string, password: string): Promise<any> {
  // Gonna have to hash the password before sending
  // Result will probably contain more strict auth stuff, like some token or something similar
  return axios.post(`/auth/login`, {
    username: email,
    password,
  });
}

export function register(
  username: string,
  password: string,
  email: string
): Promise<any> {
  // Gonna have to hash the password before sending?
  // Result will probably contain more strict auth stuff, like some token or something similar
  return axios.post(`/auth/register`, {
    username,
    password,
    email,
  });
}
