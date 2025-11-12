import axios, { Axios, AxiosInstance } from "axios";
import { env } from "env.mjs";

export const openAiClient : AxiosInstance = axios.create({
    timeout: 10000,
    headers: {
      Authorization: "Bearer " + env.OPEN_AI_API_KEY,
    },
  })
