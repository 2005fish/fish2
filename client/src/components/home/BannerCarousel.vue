<template>
  <div class="banner-carousel">
    <van-swipe :autoplay="3000" indicator-color="#ff6b35" lazy-render>
      <van-swipe-item v-for="banner in banners" :key="banner.id">
        <div class="banner-item" @click="onBannerClick(banner)">
          <img :src="banner.image_url" :alt="banner.title" />
          <div class="banner-title">{{ banner.title }}</div>
        </div>
      </van-swipe-item>
    </van-swipe>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

defineProps<{ banners: any[] }>()
const router = useRouter()

function onBannerClick(banner: any) {
  if (banner.link_type === 'novel') {
    router.push(`/novel/${banner.link_value}`)
  } else if (banner.link_type === 'category') {
    router.push('/categories')
  }
}
</script>

<style scoped>
.banner-carousel {
  margin: 0 -16px;
}
.banner-item {
  position: relative;
  height: 160px;
  cursor: pointer;
}
.banner-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.banner-title {
  position: absolute;
  bottom: 12px;
  left: 16px;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  text-shadow: 0 1px 3px rgba(0,0,0,0.5);
}
</style>
