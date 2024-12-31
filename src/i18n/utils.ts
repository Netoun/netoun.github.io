import { ui } from "./ui"

export const languages = {
  en: "English",
  fr: "Français"
}

export const defaultLang = "en"

function interpolate(text: string, values: Record<string, string>) {
  return text.replace(/{(\w+)}/g, (match, key) => values[key] || match)
}

export function useTranslatedText(lang: keyof typeof languages) {
  return function t(
    key: keyof (typeof ui)[typeof defaultLang],
    values?: Record<string, string>
  ) {
    const translation = ui[lang][key] ?? ui[defaultLang][key]
    if (!translation) {
      console.warn(`Missing translation for key: ${key}`)
      return key
    }
    return interpolate(translation, values ?? {})
  }
}
