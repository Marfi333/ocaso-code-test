<template>
  <div
    class="px-4 mt-4 mb-8 prose md:mx-auto md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl prose-base max-w-none simple-text"
  >
    <div v-html="text" />
  </div>
</template>

<script setup lang="ts">
  import type { WithTypename } from '~/types/graphql';
  import type { SimpleText } from '~/types/strapi';

  type SimpleTextComponent = WithTypename<SimpleText>;

  const { component } = defineProps<{
    component: SimpleTextComponent;
  }>();

  const text = component.text;
</script>
