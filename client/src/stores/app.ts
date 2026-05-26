import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const loading = ref(false)
  const theme = ref('day')

  function setLoading(val: boolean) {
    loading.value = val
  }

  function setTheme(val: string) {
    theme.value = val
  }

  return { loading, theme, setLoading, setTheme }
})
