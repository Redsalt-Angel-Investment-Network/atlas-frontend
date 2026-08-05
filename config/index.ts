import development from "./development";
import staging from "./staging";
import production from "./production";

const configs = {
  development,
  staging,
  production,
};

const env =
  (process.env.NEXT_PUBLIC_ENV as keyof typeof configs) ??
  "development";

export default configs[env];