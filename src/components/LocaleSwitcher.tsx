"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { locales, type Locale } from "@/i18n/messages";
import { useSetLocale } from "@/utils/providers";

const names = { en: "English", fr: "Français" } as const;

function pathWithoutLocale(pathname: string) {
  const match = pathname.match(/^\/(en|fr)(?=\/|$)/);
  return match ? pathname.slice(match[0].length) || "/" : pathname;
}

export function LocaleSwitcher() {
  const t = useTranslations("LocaleSwitcher");
  const locale = useLocale();
  const setLocale = useSetLocale();
  const router = useRouter();
  const pathname = usePathname();

  function switchLocale(next: Locale) {
    if (next === locale) return;
    setLocale(next);
    const path = pathWithoutLocale(pathname);
    void router.replace(`/${next}${path === "/" ? "" : path}`);
  }

  return (
    <div
      role="group"
      aria-label={t("switchTo", { language: names[locale as Locale] })}
      className="inline-flex rounded-full border border-black/[.08] p-0.5 dark:border-white/[.145]"
    >
      {locales.map((code) => {
        const active = locale === code;
        return (
          <button
            key={code}
            type="button"
            aria-current={active ? "true" : undefined}
            aria-label={t("switchTo", { language: names[code] })}
            className={`min-w-9 rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
              active
                ? "bg-zinc-950 text-zinc-50 dark:bg-zinc-50 dark:text-zinc-950"
                : "text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50"
            }`}
            onClick={() => switchLocale(code)}
          >
            {code.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}
