import { useEffect, useState } from "react";
import { parseCookies, setCookie } from "nookies";
import { NextPageContext } from "next";

export const COOKIE_NAME = "googtrans";

export interface LanguageDescriptor {
  name: string;
  title: string;
}

export interface LanguageConfig {
  languages: LanguageDescriptor[];
  defaultLanguage: string;
}

export type UseLanguageSwitcherResult = {
  currentLanguage: string;
  switchLanguage: (lang: string) => () => void;
  languageConfig: LanguageConfig | undefined;
};

export type UseLanguageSwitcherOptions = {
  context?: NextPageContext;
};

export const getLanguageConfig = (): LanguageConfig | undefined => {
  let cfg: LanguageConfig | undefined;

  if (process.env.GOOGLE_TRANSLATION_CONFIG) {
    try {
      cfg = JSON.parse(process.env.GOOGLE_TRANSLATION_CONFIG ?? "{}");
    } catch (e) {}
  }

  return cfg;
};

export const useLanguageSwitcher = ({
    context,
  }: UseLanguageSwitcherOptions = {}): UseLanguageSwitcherResult => {
    const [currentLanguage, setCurrentLanguage] = useState<string>("");
    const [languageConfig, setLanguageConfig] = useState<LanguageConfig | undefined>(undefined);
  
    useEffect(() => {
      const cfg = getLanguageConfig();
      const cookies = parseCookies(context);
      const existingLanguageCookieValue = cookies[COOKIE_NAME];
  
      let languageValue = "";
      if (existingLanguageCookieValue) {
        const sp = existingLanguageCookieValue.split("/");
        if (sp.length > 2) {
          languageValue = sp[2];
        }
      }
      if (cfg && !languageValue) {
        languageValue = cfg.defaultLanguage;
      }
  
      if (languageValue) {
        setCurrentLanguage(languageValue);
      }
  
      if (cfg) {
        setLanguageConfig(cfg);
      }
    }, [context]);
  
    const switchLanguage = (lang: string) => () => {
      setCookie(context, COOKIE_NAME, "/auto/" + lang);
      window.location.reload();
    };
  
    return {
      currentLanguage,
      switchLanguage,
      languageConfig,
    };
  };
  

export default useLanguageSwitcher;