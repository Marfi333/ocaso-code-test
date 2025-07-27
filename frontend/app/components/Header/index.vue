<template>
  <header 
    class="header"
    :class="{
      'header--hidden': isHeaderHidden,
      'header--visible': !isHeaderHidden
    }"
  >
    <div class="header__container">
      <div class="header__content">
        <!-- Logo -->
        <div class="header__logo-section">
          <NuxtLink :to="getLocalizedHomePage()" class="header__logo" aria-label="Home" :title="t('header.logo.title')">
            <SharedStrapiImage
              :media="siteOptions.siteLogo"
              image-class="header__logo-image"
              format="webp"
              :quality="80"
              :show-placeholder="false"
            />
          </NuxtLink>
          <div class="lang-switcher">
            <button
              v-for="l in availableLocales"
              :key="l.code"
              :class="['lang-switcher__btn', { 'lang-switcher__btn--active': l.code === currentLocale }]"
              :disabled="l.code === currentLocale"
              @click="setLocale(l.code)"
            >
              {{ l.code.toUpperCase() }}
            </button>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="header__nav">
          <HeaderMenu :menu-items="siteOptions?.headerMenu?.menuItems || []" />
        </nav>

        <!-- Mobile menu -->
        <HeaderMobileMenu class="md:hidden" :menu-items="siteOptions?.headerMenu?.menuItems || []" />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
  import type { SiteOption } from '~/types/strapi';
  const { t } = useI18n();
  const { getLocalizedHomePage } = useUrl()

  defineProps<{
    siteOptions: SiteOption;
  }>();

  const { locale, locales, setLocale } = useI18n();
  const currentLocale = locale;
  const availableLocales = locales;

  // Scroll behavior state
  const isHeaderHidden = ref(false);
  const lastScrollY = ref(0);
  const scrollThreshold = 10;

  // Handle scroll behavior
  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY <= scrollThreshold) {
      isHeaderHidden.value = false;
      lastScrollY.value = currentScrollY;
      return;
    }
    
    const scrollDifference = currentScrollY - lastScrollY.value;
    
    if (Math.abs(scrollDifference) > scrollThreshold) {
      if (scrollDifference > 0) {
        isHeaderHidden.value = true;
      } else {
        isHeaderHidden.value = false;
      }
      
      lastScrollY.value = currentScrollY;
    }
  };

  onMounted(() => {
    lastScrollY.value = window.scrollY;
    window.addEventListener('scroll', handleScroll, { passive: true });
  });

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
  });
</script>

<style lang="scss" scoped>
  .header {
    @apply bg-white shadow-sm border-b border-gray-200;
    @apply fixed top-0 left-0 right-0 z-10;
    @apply transition-transform duration-300 ease-in-out;

    &--hidden {
      @apply -translate-y-full;
    }

    &--visible {
      @apply translate-y-0;
    }

    &__container {
      @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
    }

    &__content {
      @apply flex justify-between items-center h-16;
    }

    &__logo-section {
      @apply flex items-center;
    }

    &__logo {
      @apply flex items-center mr-6;
    }

    &__logo-image {
      @apply h-8 w-auto;
    }

    &__logo-text {
      @apply text-xl font-bold text-gray-900;
    }

    &__nav {
      @apply hidden md:flex space-x-8;
    }

    &__nav-link {
      @apply text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium;
    }
  }

  .lang-switcher {
    @apply flex gap-4;
    &__btn {
      @apply px-4 py-2 border border-gray-300 bg-gray-100 cursor-pointer rounded font-bold transition-colors duration-200;
      &--active,
      &:disabled {
        @apply bg-gray-800 text-white cursor-default;
      }
    }
  }
</style>
