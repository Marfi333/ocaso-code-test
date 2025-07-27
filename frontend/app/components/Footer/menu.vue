<template>
  <div class="footer-menu">
    <div v-for="menu in menuItems" :key="menu.id" class="footer-menu__block">
      <div v-for="menuItem in menu.menuItems" :key="menuItem.label" class="footer-menu__section">
        <h3 v-if="menuItem.subItems && menuItem.subItems.length > 0" class="footer-menu__title">
          {{ menuItem.label }}
        </h3>
        <NuxtLink
          v-else-if="menuItem.url || menuItem.page?.slug"
          :to="getLocalizedUrl(menuItem)"
          :target="menuItem.target"
          class="footer-menu__direct-link"
          :title="t('menu.navigateTo', { label: menuItem.label })"
        >
          {{ menuItem.label }}
        </NuxtLink>
        
        <ul v-if="menuItem.subItems && menuItem.subItems.length > 0" class="footer-menu__list">
          <li v-for="subItem in menuItem.subItems" :key="subItem.label" class="footer-menu__item">
            <NuxtLink
              v-if="subItem.url || subItem.page?.slug"
              :to="getLocalizedUrl(subItem)"
              :target="subItem.target"
              class="footer-menu__link"
              :title="t('menu.navigateTo', { label: subItem.label })"
              :class="{ 'footer-menu__link--active': isActiveLink(getLocalizedUrl(subItem)) }"
            >
              {{ subItem.label }}
            </NuxtLink>
            <span v-else class="footer-menu__link footer-menu__link--disabled">
              {{ subItem.label }}
            </span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { Menu } from '~/types/strapi';

  defineProps<{
    menuItems: Menu[];
  }>();

  const route = useRoute();
  const { t } = useI18n();
  const { getLocalizedUrl } = useLocaleNavigation();

  const isActiveLink = (url: string) => {
    if (!url) return false;
    return route.path === url;
  };
</script>

<style lang="scss" scoped>
  .footer-menu {
    @apply flex flex-col gap-y-4;

    &__block {
      @apply flex flex-col gap-y-3;
    }

    &__section {
      @apply flex flex-col min-w-40 pb-3;
    }

    &__title {
      @apply text-sm font-semibold text-gray-900 mb-2;
      @apply border-b border-gray-200 pb-1;
    }

    &__list {
      @apply flex flex-col space-y-1.5;
    }

    &__item {
      @apply relative;
    }

    &__direct-link {
      @apply text-sm font-medium text-gray-700 hover:text-gray-900;
      @apply transition-colors duration-200;
      @apply border-b border-transparent hover:border-gray-300;
      @apply pb-0.5;
      
      &.router-link-active {
        @apply text-blue-600 border-blue-300;
      }
    }

    &__link {
      @apply text-gray-600 hover:text-gray-900 text-sm transition-colors duration-200;
      @apply block py-0.5;

      &--active {
        @apply text-blue-600 font-medium;
      }

      &--disabled {
        @apply text-gray-400 cursor-not-allowed;
      }
    }
  }

  @media (min-width: 641px) {
    .footer-menu {
      @apply flex-wrap flex-row gap-x-8 gap-y-6;
      
      &__block {
        @apply flex-wrap flex-row gap-x-6 gap-y-4;
      }
      
      &__section {
        @apply pb-0;
      }
    }
  }
</style> 