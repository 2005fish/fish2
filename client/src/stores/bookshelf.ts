import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getBookshelf, addToBookshelf as addApi, removeFromBookshelf as removeApi, checkBookshelf } from '@/api/bookshelf'

export const useBookshelfStore = defineStore('bookshelf', () => {
  const novels = ref<any[]>([])

  async function fetch() {
    try {
      novels.value = await getBookshelf() as any[]
    } catch { /* not logged in */ }
  }

  async function add(novelId: number) {
    await addApi(novelId)
    await fetch()
  }

  async function remove(novelId: number) {
    await removeApi(novelId)
    novels.value = novels.value.filter((n: any) => n.novel_id !== novelId)
  }

  async function check(novelId: number): Promise<boolean> {
    try {
      const res: any = await checkBookshelf(novelId)
      return res.inBookshelf
    } catch {
      return false
    }
  }

  return { novels, fetch, add, remove, check }
})
