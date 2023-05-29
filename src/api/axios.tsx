import axios from "axios";
const BASE_URL =
  process.env.NODE_ENV !== "production"
    ? "http://localhost:4000/"
    : "http://cica.profroxas.duckdns.org";
export default axios.create({
  baseURL: BASE_URL,
});

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
});
