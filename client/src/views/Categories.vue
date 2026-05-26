<template>
  <div class="categories-page">
    <AppNavBar title="分类" fixed placeholder />

    <div class="categories-layout" v-if="categories.length">
      <CategorySidebar :categories="categories" @change="onCategoryChange" />
      <CategoryNovelList :key="activeCategoryId" :categoryId="activeCategoryId" />
    </div>
    <LoadingSpinner v-else />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getCategories } from '@/api/novels'
import AppNavBar from '@/components/common/AppNavBar.vue'
import CategorySidebar from '@/components/category/CategorySidebar.vue'
import CategoryNovelList from '@/components/category/CategoryNovelList.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const categories = ref<any[]>([])
const activeCategoryId = ref(1)

onMounted(async () => {
  const res: any = await getCategories()
  categories.value = res
  if (res.length) activeCategoryId.value = res[0].id
})

function onCategoryChange(id: number) {
  activeCategoryId.value = id
}
</script>

<style scoped>
.categories-page {
  min-height: 100vh;
  background: #fff;
  padding-bottom: 60px;
}
.categories-layout {
  display: flex;
  height: calc(100vh - 46px - 50px);
}
</style>
