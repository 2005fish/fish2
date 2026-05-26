export function getItem<T>(key: string, defaultValue: T): T {
  try {
    const val = localStorage.getItem(key)
    return val ? JSON.parse(val) : defaultValue
  } catch {
    return defaultValue
  }
}

export function setItem(key: string, value: any) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch { /* quota exceeded, ignore */ }
}

export function removeItem(key: string) {
  try {
    localStorage.removeItem(key)
  } catch { /* ignore */ }
}

export function getToken(): string | null {
  return getItem<string | null>('token', null)
}

export function setToken(token: string) {
  setItem('token', token)
}

export function removeToken() {
  removeItem('token')
}
