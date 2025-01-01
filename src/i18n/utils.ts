import { z } from "astro/zod"

import { routes, showDefaultLang, ui } from "./ui"

export const languages = {
  en: "English",
  fr: "Français"
} as const

export type Languages = keyof typeof languages
export type Routes = typeof routes
export type RouteKeys = keyof Routes[Languages]

export const defaultLang = "en"

const langSchema = z.string().transform((value) => {
  const keys = Object.keys(languages)
  if (keys.includes(value)) return value
  return defaultLang
})

function interpolate(text: string, values: Record<string, string>) {
  return text.replace(/{(\w+)}/g, (match, key) => values[key] || match)
}

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split("/")
  return langSchema.parse(lang)
}

export function useTranslatedPath(lang: Languages) {
  return function translatePath(path: string, l: Languages = lang) {
    const pathName = path.replaceAll("/", "") as RouteKeys
    const hasTranslation =
      defaultLang !== l && l in routes && pathName in routes[l]
    const translatedPath = hasTranslation ? "/" + routes[l][pathName] : path

    return !showDefaultLang && l === defaultLang
      ? translatedPath
      : `/${l}${translatedPath}`
  }
}

export function useTranslatedText(lang: Languages) {
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

export function getRouteFromUrl(url: URL): string | undefined {
  const pathname = new URL(url).pathname
  const parts = pathname?.split("/")
  const path = parts.pop() || parts.pop()

  if (path === undefined) {
    return undefined
  }

  const currentLang = getLangFromUrl(url) as Languages

  if (defaultLang === currentLang) {
    if (!(currentLang in routes)) return undefined
    const route = routes[currentLang]
    const pathAsKey = path as RouteKeys
    return pathAsKey in route ? route[pathAsKey] : undefined
  }

  const getKeyByValue = (
    obj: Record<string, string>,
    value: string
  ): string | undefined => {
    return Object.keys(obj).find((key) => obj[key] === value)
  }

  if (!(currentLang in routes)) return undefined
  const reversedKey = getKeyByValue(routes[currentLang], path)

  if (reversedKey !== undefined) {
    return reversedKey
  }

  return undefined
}
