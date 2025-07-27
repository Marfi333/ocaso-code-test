import type { MenuItem } from '~/types/strapi'

export const useLocaleNavigation = () => {
  const router = useRouter();
  const graphql = useStrapiGraphQL();
  const { defaultLocale, locale } = useI18n();

  const currentPageInfo = useState<{
    documentId?: string;
    slug?: string;
    isHomepage: boolean;
  }>('currentPageInfo', () => ({
    isHomepage: false
  }));

  const updateCurrentPageInfo = (documentId?: string, slug?: string, isHomepage = false) => {
    currentPageInfo.value = {
      documentId,
      slug,
      isHomepage
    };
  }

  const findPageInLocale = async (targetLocale: string): Promise<string | null> => {
    try {
      // If we're on homepage, always go to target locale homepage
      if (currentPageInfo.value.isHomepage) {
        return targetLocale === defaultLocale ? '/' : `/${targetLocale}`;
      }

      // If we have a documentId, try to find the same page in target locale
      if (currentPageInfo.value.documentId) {
        const query = `
          query GetPageByDocumentId($locale: I18NLocaleCode!, $documentId: ID!) {
            pages(filters: { documentId: { eq: $documentId } }, locale: $locale) {
              documentId
              slug
            }
          }
        `;

        const response = await graphql<{
          data: {
            pages: Array<{
              documentId: string;
              slug: string;
            }>;
          };
        }>(query, {
          locale: targetLocale,
          documentId: currentPageInfo.value.documentId
        });

        const page = response.data?.pages?.[0];
        if (page?.slug) {
          // Return the localized URL
          return targetLocale === defaultLocale ? `/${page.slug}` : `/${targetLocale}/${page.slug}`;
        }
      }

      // No translation found
      return null;
    } catch (error) {
      console.error('Error finding page in locale:', error);
      return null;
    }
  }

  const navigateToLocale = async (targetLocale: string) => {
    try {
      const targetUrl = await findPageInLocale(targetLocale);
      
      if (targetUrl) {
        await router.push(targetUrl);
      } else {
        // Fallback to home page
        throw new Error('Page not found')
      }
    } catch (error) {
      console.error('Error navigating to locale:', error);

      const homeUrl = targetLocale === defaultLocale ? '/' : `/${targetLocale}`;
      await router.push(homeUrl);
    }
  }

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
    currentPageInfo: readonly(currentPageInfo),
    updateCurrentPageInfo,
    findPageInLocale,
    navigateToLocale,
    getLocalizedHomePage,
    getLocalizedUrl
  }
};