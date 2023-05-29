import axios from "axios";
const BASE_URL = "http://localhost:4000";
// const BASE_URL = "http://cica.profroxas.duckdns.org";
export default axios.create({
  baseURL: BASE_URL,
});

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
});
