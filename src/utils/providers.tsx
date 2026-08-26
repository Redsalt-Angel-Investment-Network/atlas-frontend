"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { NextIntlClientProvider } from "next-intl";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { locales, messages, type Locale } from "@/i18n/messages";

const SetLocaleContext = createContext<(locale: Locale) => void>(() => {});

export function useSetLocale() {
  return useContext(SetLocaleContext);
}

export function Providers({
  locale: initialLocale,
  children,
}: {
  locale: string;
  children: React.ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>(
    locales.find((value) => value === initialLocale) ?? "en",
  );

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    document.documentElement.lang = next;
    document.cookie = `NEXT_LOCALE=${next};path=/;max-age=31536000;samesite=lax`;
  }, []);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
    >
      <SetLocaleContext.Provider value={setLocale}>
        <NextIntlClientProvider locale={locale} messages={messages[locale]}>
          <TooltipProvider>
            {children}
          </TooltipProvider>
        </NextIntlClientProvider>
      </SetLocaleContext.Provider>
    </ThemeProvider>
  );
}
