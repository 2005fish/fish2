<template>
  <van-nav-bar
    :title="title"
    :left-arrow="showBack"
    :fixed="fixed"
    :placeholder="placeholder"
    @click-left="$router.back()"
  >
    <template #right v-if="$slots.right">
      <slot name="right" />
    </template>
  </van-nav-bar>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  title: string
  showBack?: boolean
  fixed?: boolean
  placeholder?: boolean
}>(), {
  showBack: false,
  fixed: false,
  placeholder: false,
})
</script>
