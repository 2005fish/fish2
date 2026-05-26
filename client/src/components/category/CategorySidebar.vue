<template>
  <van-sidebar v-model="active" @change="onChange">
    <van-sidebar-item
      v-for="cat in categories"
      :key="cat.id"
      :title="cat.name"
      :badge="cat.novel_count || undefined"
    />
  </van-sidebar>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ categories: any[] }>()
const emit = defineEmits<{ change: [id: number] }>()
const active = ref(0)

function onChange(index: number) {
  emit('change', (arguments[0] as any)?.id || index + 1)
}
</script>
