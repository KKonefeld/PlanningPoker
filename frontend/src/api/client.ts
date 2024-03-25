import { config } from "@/config";
import axios, { isAxiosError } from "axios";
// // @ts-ignore
// import curlirize from "axios-curlirize";

const APP_TIMEOUT = 9_000;

export const api = axios.create({
  baseURL: config.baseUrl + "/api/",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: APP_TIMEOUT,
});

// curlirize(api);
