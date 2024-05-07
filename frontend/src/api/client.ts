import { config } from "@/config";
import axios, { isAxiosError } from "axios";
// // @ts-ignore
import curlirize from "axios-curlirize";

const APP_TIMEOUT = 9_000;

export const api = axios.create({
  baseURL: "https://localhost:7008/api/", // config.baseUrl
  headers: {
    "Content-Type": "application/json",
  },
  timeout: APP_TIMEOUT,
});

curlirize(api);
