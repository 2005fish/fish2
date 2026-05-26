<template>
  <div class="empty-state">
    <van-empty :image="image" :description="description">
      <slot />
    </van-empty>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  description?: string
  image?: string
}>(), {
  description: '暂无数据',
  image: 'search',
})
</script>

<style scoped>
.empty-state {
  padding: 60px 0;
}
</style>
