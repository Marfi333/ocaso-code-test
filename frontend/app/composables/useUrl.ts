import type { MenuItem } from '~/types/strapi'

export const useUrl = () => {
  const { defaultLocale, locale } = useI18n()

  const getLocalizedUrl = (item: MenuItem) => {
    const url = item.url ?? item.page?.slug
    if (!url) return ''

    // If it's already a full URL, return as is
    if (url.startsWith('http')) return url

    // If it's the default locale, return without prefix
    if (locale.value === defaultLocale) return url

    // For other locales, add the locale prefix
    return `/${locale.value}/${url}`
  }

  const getLocalizedHomePage = () => {
    return locale.value === defaultLocale
      ? '/'
      : `/${locale.value}`
  }

  return {
    getLocalizedUrl,
    getLocalizedHomePage
  }
}