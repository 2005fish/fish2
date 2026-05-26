<template>
  <router-view v-slot="{ Component, route }">
    <keep-alive>
      <component :is="Component" v-if="route.meta.keepAlive" :key="route.name" />
    </keep-alive>
    <component :is="Component" v-if="!route.meta.keepAlive" :key="route.fullPath" />
  </router-view>
  <AppTabBar v-if="showTabBar && !isFullscreen" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppTabBar from '@/components/common/AppTabBar.vue'

const route = useRoute()

const showTabBar = computed(() => route.meta.tabIndex !== undefined)
const isFullscreen = computed(() => route.meta.fullscreen === true)
</script>
