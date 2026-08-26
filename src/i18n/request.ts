import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { headers } from "next/headers";
import { locales, messages } from "./messages";

export default getRequestConfig(async () => {
  const requested = (await headers()).get("x-locale");
  const locale = hasLocale(locales, requested) ? requested : "en";

  return {
    locale,
    messages: messages[locale],
  };
});
