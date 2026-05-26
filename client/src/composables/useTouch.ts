import { ref } from 'vue'

export function useTouch(options: {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onTap?: () => void
  threshold?: number
}) {
  const startX = ref(0)
  const startY = ref(0)
  const deltaX = ref(0)
  const deltaY = ref(0)
  const isSwiping = ref(false)
  const startTime = ref(0)

  function onTouchStart(e: TouchEvent) {
    startX.value = e.touches[0].clientX
    startY.value = e.touches[0].clientY
    deltaX.value = 0
    deltaY.value = 0
    isSwiping.value = false
    startTime.value = Date.now()
  }

  function onTouchMove(e: TouchEvent) {
    deltaX.value = e.touches[0].clientX - startX.value
    deltaY.value = e.touches[0].clientY - startY.value
    if (Math.abs(deltaX.value) > Math.abs(deltaY.value) && Math.abs(deltaX.value) > 10) {
      isSwiping.value = true
    }
  }

  function onTouchEnd() {
    const threshold = options.threshold ?? 60
    const dt = Date.now() - startTime.value

    // Tap detection: short touch with minimal movement
    if (Math.abs(deltaX.value) < 10 && Math.abs(deltaY.value) < 10 && dt < 300) {
      options.onTap?.()
      return
    }

    if (!isSwiping.value) return
    if (deltaX.value < -threshold) {
      options.onSwipeLeft?.()
    } else if (deltaX.value > threshold) {
      options.onSwipeRight?.()
    }
    isSwiping.value = false
    deltaX.value = 0
    deltaY.value = 0
  }

  return { onTouchStart, onTouchMove, onTouchEnd, deltaX, isSwiping }
}
