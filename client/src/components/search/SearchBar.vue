<template>
  <form class="search-bar" @submit.prevent="onSearch">
    <van-search
      v-model="keyword"
      placeholder="搜索书名、作者"
      shape="round"
      @search="onSearch"
      autofocus
    />
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const keyword = ref('')
const emit = defineEmits<{ search: [q: string] }>()

function onSearch() {
  if (keyword.value.trim()) {
    emit('search', keyword.value.trim())
  }
}
</script>
