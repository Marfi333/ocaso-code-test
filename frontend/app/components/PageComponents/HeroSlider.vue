<template>
  <div class="hero-slider-container">
    <div class="hero-slider">
      <Swiper
        :modules="[Autoplay, Navigation, Pagination]"
        :slides-per-view="1"
        :space-between="0"
        :loop="true"
        :effect="component.slideEffect || 'fade'"
        :speed="1000"
        :navigation="true"
        :pagination="{ clickable: true }"
        :autoplay="autoplayOptions"
        class="hero-swiper"
      >
        <SwiperSlide v-for="(slide, index) in component.Slides" :key="index" class="hero-slide">
          <SharedStrapiPicture
            :media="slide.image"
            :alt="slide.image?.alternativeText || ''"
            :loading="index === 0 ? 'eager' : 'lazy'"
            :fetchpriority="index === 0 ? 'high' : 'auto'"
            :class="slide.mobileImage ? 'hero-slide__image' : 'hero-slide__image hero-slide__image--fallback'"
          />
          <SharedStrapiPicture
            v-if="slide.mobileImage"
            :media="slide.mobileImage"
            :alt="slide.mobileImage?.alternativeText || ''"
            :loading="index === 0 ? 'eager' : 'lazy'"
            :fetchpriority="index === 0 ? 'high' : 'auto'"
            class="hero-slide__mobile-image"
          />
        </SwiperSlide>
      </Swiper>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { Swiper, SwiperSlide } from 'swiper/vue';
  import { Autoplay, Navigation, Pagination } from 'swiper/modules';
  import 'swiper/css';
  import 'swiper/css/navigation';
  import 'swiper/css/pagination';

  import type { WithTypename } from '~/types/graphql';
  import type { HeroSlider } from '~/types/strapi';

  type HeroSliderComponent = WithTypename<HeroSlider>;

  const props = defineProps<{
    component: HeroSliderComponent;
  }>();
  Swiper;
  const autoplayOptions = computed(() =>
    props.component?.autoPlayTimerSec ? { delay: props.component.autoPlayTimerSec * 1000 } : false
  );
</script>

<style scoped>
  .hero-slider-container {
    @apply relative w-full overflow-hidden max-w-full;
    height: 350px;
  }

  @media (min-width: 768px) {
    .hero-slider-container {
      height: 500px;
    }
  }

  .hero-slider {
    /* TODO: Remove magic numbers */
    @apply relative w-full h-full;
    margin-left: calc(-50vw + 50%);
    margin-right: calc(-50vw + 50%);
    width: 100vw;
  }

  .hero-swiper {
    @apply w-full h-full;
  }

  .hero-slide {
    @apply relative w-full h-full bg-transparent;
  }

  .hero-slide__image,
  .hero-slide__mobile-image {
    @apply w-full h-full absolute top-0 left-0;
  }

  .hero-slide__image {
    @apply hidden md:block;

    &--fallback {
      @apply block;
    }
  }

  .hero-slide__mobile-image {
    @apply block md:hidden;
  }

  :deep(.hero-slide__image img),
  :deep(.hero-slide__mobile-image img) {
    @apply w-full h-full object-cover object-center;
    max-width: none;
    display: block;
  }

  :deep(.swiper-button-next),
  :deep(.swiper-button-prev) {
    @apply text-white bg-black/20 hover:bg-black/40 transition-colors duration-200;
    @apply w-12 h-12 rounded-full;
  }

  :deep(.swiper-button-next) {
    @apply right-4;
  }

  :deep(.swiper-button-prev) {
    @apply left-4;
  }

  :deep(.swiper-pagination-bullet) {
    @apply bg-white/60 hover:bg-white transition-colors duration-200;
  }

  :deep(.swiper-pagination-bullet-active) {
    @apply bg-white;
  }
</style>
