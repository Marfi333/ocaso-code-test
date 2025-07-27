<template>
  <div>
    <button
      class="p-2 text-gray-700 transition-colors duration-200 rounded-md hover:text-gray-900 hover:bg-gray-50 md:hidden"
      @click="isOpen = true"
      aria-label="Open mobile menu"
    >
      <Icon name="heroicons:bars-3" class="w-6 h-6" />
    </button>

    <HeadlessDialog 
      :open="isOpen" 
      @close="closeMenu"
      class="relative z-50 md:hidden"
    >
      <HeadlessDialogBackdrop
        enter="ease-in-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in-out duration-300"
        leave-from="opacity-100"
        leave-to="opacity-0"
        class="fixed inset-0 z-20 transition-opacity bg-gray-600 bg-opacity-75"
      />

      <div class="fixed inset-0 overflow-hidden">
        <div class="absolute inset-0 overflow-hidden">
          <div class="fixed inset-y-0 right-0 flex max-w-full pl-10 pointer-events-none">
            <HeadlessDialogPanel
              enter="transform transition ease-in-out duration-300"
              enter-from="translate-x-full"
              enter-to="translate-x-0"
              leave="transform transition ease-in-out duration-300"
              leave-from="translate-x-0"
              leave-to="translate-x-full"
              class="relative w-screen max-w-md pointer-events-auto"
            >
              <div class="flex flex-col h-full py-6 overflow-y-scroll bg-white shadow-xl">
                <div class="px-4 sm:px-6">
                  <div class="flex items-center justify-between">
                    <HeadlessDialogTitle class="text-base font-semibold leading-6 text-gray-900">
                      Menu
                    </HeadlessDialogTitle>
                    <div class="flex items-center ml-3 h-7">
                      <button
                        type="button"
                        class="relative p-2 -m-2 text-gray-400 hover:text-gray-500"
                        @click="closeMenu"
                        aria-label="Close mobile menu"
                      >
                        <Icon name="heroicons:x-mark" class="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                </div>

                <div class="relative flex-1 px-4 mt-6 sm:px-6">
                  <div class="pb-6 mb-6 border-b border-gray-200">
                    <div class="flex gap-2">
                      <button
                        v-for="l in availableLocales"
                        :key="l.code"
                        :class="[
                          'px-3 py-2 border border-gray-300 bg-gray-100 cursor-pointer rounded font-bold transition-colors duration-200',
                          { 'bg-gray-800 text-white cursor-default': l.code === currentLocale }
                        ]"
                        :disabled="l.code === currentLocale"
                        @click="handleLocaleChange(l.code)"
                      >
                        {{ l.code.toUpperCase() }}
                      </button>
                    </div>
                  </div>

                  <nav class="space-y-1">
                    <template v-for="item in menuItems" :key="item.label">
                      <NuxtLink
                        v-if="(item.url || item.page?.slug) && !hasSubItems(item)"
                        :to="getLocalizedUrl(item)"
                        :target="item.target"
                        class="block px-3 py-2 text-base font-medium text-gray-700 transition-colors duration-200 rounded-md hover:text-gray-900 hover:bg-gray-50"
                        @click="closeMenu"
                      >
                        {{ item.label }}
                      </NuxtLink>
                      
                      <div v-else-if="hasSubItems(item)" class="space-y-1">
                        <button
                          class="flex items-center justify-between w-full px-3 py-2 text-base font-medium text-gray-700 transition-colors duration-200 rounded-md hover:text-gray-900 hover:bg-gray-50"
                          :class="{ 'text-gray-900 bg-gray-50': expandedItems.has(item.label) }"
                          @click="toggleExpanded(item.label)"
                        >
                          {{ item.label }}
                          <Icon 
                            :name="expandedItems.has(item.label) ? 'heroicons:chevron-up' : 'heroicons:chevron-down'"
                            class="w-4 h-4"
                          />
                        </button>
                        
                        <div 
                          v-show="expandedItems.has(item.label)"
                          class="ml-4 space-y-1"
                        >
                          <template v-for="subItem in item.subItems" :key="subItem.label">
                            <NuxtLink
                              v-if="subItem.url || subItem.page?.slug"
                              :to="getLocalizedUrl(subItem)"
                              :target="subItem.target"
                              class="block px-3 py-2 text-sm font-medium text-gray-600 transition-colors duration-200 rounded-md hover:text-gray-900 hover:bg-gray-50"
                              @click="closeMenu"
                            >
                              {{ subItem.label }}
                            </NuxtLink>
                            <span
                              v-else
                              class="block px-3 py-2 text-sm font-medium text-gray-400 transition-colors duration-200 rounded-md cursor-not-allowed hover:text-gray-900 hover:bg-gray-50 hover:bg-transparent"
                            >
                              {{ subItem.label }}
                            </span>
                          </template>
                        </div>
                      </div>
                      
                      <span v-else class="block px-3 py-2 text-base font-medium text-gray-700 transition-colors duration-200 rounded-md hover:text-gray-900 hover:bg-gray-50 mobile-menu__link--disabled">
                        {{ item.label }}
                      </span>
                    </template>
                  </nav>
                </div>
              </div>
            </HeadlessDialogPanel>
          </div>
        </div>
      </div>
    </HeadlessDialog>
  </div>
</template>

<script setup lang="ts">
import type { MenuItem } from '~/types/strapi';

defineProps<{
  menuItems: MenuItem[];
}>();

const { getLocalizedUrl } = useUrl();
const { locale, locales, setLocale } = useI18n();

const isOpen = ref(false);
const expandedItems = ref(new Set<string>());

const currentLocale = locale;
const availableLocales = locales;

const hasSubItems = (item: MenuItem) => {
  return item.subItems && item.subItems.length > 0;
};

const toggleExpanded = (itemLabel: string) => {
  if (expandedItems.value.has(itemLabel)) {
    expandedItems.value.delete(itemLabel);
  } else {
    expandedItems.value.add(itemLabel);
  }
  expandedItems.value = new Set(expandedItems.value);
};

const closeMenu = () => {
  isOpen.value = false;
  expandedItems.value.clear();
};

const handleLocaleChange = (newLocale: 'de' | 'en') => {
  setLocale(newLocale);
  closeMenu();
};

// Lock scroll when menu is open
watch(isOpen, (newValue) => {
  if (newValue) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});

// Cleanup on unmount
onUnmounted(() => {
  document.body.style.overflow = '';
});
</script>

<style lang="scss" scoped>
.router-link-active {
  @apply text-blue-600 bg-blue-50;
}
</style> 