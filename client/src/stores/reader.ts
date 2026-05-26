import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import { getItem, setItem } from '@/utils/storage'

export const useReaderStore = defineStore('reader', () => {
  const currentNovel = ref<any>(null)
  const currentChapter = ref<any>(null)
  const totalChapters = ref(0)
  const prevChapter = ref<any>(null)
  const nextChapter = ref<any>(null)
  const pages = ref<string[]>([])

  const settings = reactive({
    fontSize: getItem('reader_fontSize', 18),
    lineHeight: getItem('reader_lineHeight', 1.8),
    theme: getItem('reader_theme', 'day'),
    pageMode: getItem('reader_pageMode', 'scroll'),
  })

  function saveSettings() {
    setItem('reader_fontSize', settings.fontSize)
    setItem('reader_lineHeight', settings.lineHeight)
    setItem('reader_theme', settings.theme)
    setItem('reader_pageMode', settings.pageMode)
  }

  function setNovel(novel: any) {
    currentNovel.value = novel
  }

  function setChapter(chapter: any, total: number, prev: any, next: any) {
    currentChapter.value = chapter
    totalChapters.value = total
    prevChapter.value = prev
    nextChapter.value = next
  }

  return { currentNovel, currentChapter, totalChapters, prevChapter, nextChapter, pages, settings, saveSettings, setNovel, setChapter }
})
