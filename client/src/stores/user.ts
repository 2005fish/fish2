import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login as loginApi, register as registerApi, getProfile } from '@/api/user'
import { getToken as storageGetToken, setToken as storageSetToken, removeToken } from '@/utils/storage'

export const useUserStore = defineStore('user', () => {
  const token = ref<string | null>(storageGetToken())
  const user = ref<any>(null)
  const isLoggedIn = computed(() => !!token.value)

  async function login(username: string, password: string) {
    const res: any = await loginApi(username, password)
    token.value = res.token
    user.value = res.user
    storageSetToken(res.token)
  }

  async function register(username: string, password: string, nickname: string) {
    const res: any = await registerApi(username, password, nickname)
    token.value = res.token
    user.value = res.user
    storageSetToken(res.token)
  }

  function logout() {
    token.value = null
    user.value = null
    removeToken()
  }

  async function fetchProfile() {
    if (!token.value) return
    try {
      user.value = await getProfile()
    } catch {
      logout()
    }
  }

  return { token, user, isLoggedIn, login, register, logout, fetchProfile }
})
