<template>
  <div class="bookshelf-page">
    <van-nav-bar title="我的书架" fixed placeholder>
      <template #right>
        <span class="edit-btn" @click="isEditMode = !isEditMode">
          {{ isEditMode ? '完成' : '编辑' }}
        </span>
      </template>
    </van-nav-bar>

    <van-tabs v-model:active="activeTab">
      <van-tab title="收藏">
        <BookshelfGrid :novels="novels" :isEditMode="isEditMode" @remove="onRemove" />
      </van-tab>
      <van-tab title="历史">
        <HistoryList :history="historyList" />
      </van-tab>
    </van-tabs>

    <LoginPrompt v-if="!userStore.isLoggedIn" message="登录后可同步书架" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useUserStore } from '@/stores/user'
import { useBookshelfStore } from '@/stores/bookshelf'
import { getHistory } from '@/api/history'
import BookshelfGrid from '@/components/bookshelf/BookshelfGrid.vue'
import HistoryList from '@/components/bookshelf/HistoryList.vue'
import LoginPrompt from '@/components/common/LoginPrompt.vue'

const userStore = useUserStore()
const bookshelfStore = useBookshelfStore()

const activeTab = ref(0)
const isEditMode = ref(false)
const novels = ref<any[]>([])
const historyList = ref<any[]>([])

watch(() => userStore.isLoggedIn, async (loggedIn) => {
  if (loggedIn) {
    await loadData()
  }
})

onMounted(async () => {
  if (userStore.isLoggedIn) {
    await loadData()
  }
})

async function loadData() {
  await bookshelfStore.fetch()
  novels.value = bookshelfStore.novels
  try {
    const res: any = await getHistory({ pageSize: 20 })
    historyList.value = res.data
  } catch { /* not logged in */ }
}

async function onRemove(item: any) {
  await bookshelfStore.remove(item.novel_id)
  novels.value = bookshelfStore.novels
}
</script>

<style scoped>
.bookshelf-page {
  min-height: 100vh;
  background: #fff;
  padding-bottom: 60px;
}
.edit-btn {
  font-size: 14px;
  color: #ff6b35;
  cursor: pointer;
}
</style>
