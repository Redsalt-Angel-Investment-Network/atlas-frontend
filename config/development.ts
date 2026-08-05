import { baseConfig } from "./base";

export default {
  ...baseConfig,
  apiUrl: process.env.NEXT_PUBLIC_API_URL!,
  logging: true,
};