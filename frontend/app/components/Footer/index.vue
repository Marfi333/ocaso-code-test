<template>
  <footer class="footer">
    <div class="footer__container">
      <div class="footer__content">
        <div class="footer__menus">
          <FooterMenu v-if="siteOptions?.footerMenus?.length" :menu-items="siteOptions.footerMenus" />
        </div>
        <p class="footer__copyright">© {{ new Date().getFullYear() }} All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
  import type { SiteOption } from '~/types/strapi';

  defineProps<{
    siteOptions: SiteOption;
  }>();
</script>

<style lang="scss" scoped>
  .footer {
    @apply bg-white border-t border-gray-200 mt-auto;

    &__container {
      @apply max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8;
    }

    &__content {
      @apply flex flex-col space-y-6;
    }

    &__menus {
      @apply w-full;
    }

    &__copyright {
      @apply text-center text-gray-500 text-sm pt-6 border-t border-gray-100;
    }
  }
</style>
