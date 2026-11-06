'use client'

import { useCallback, useEffect, useState } from 'react'

// Opens the device's own share sheet where the browser has one: Windows, macOS,
// iOS, Android, ChromeOS. canShare stays false until after mount so the server
// render and the first client render match. Callers show their plain share links
// while it is false, which covers desktop Firefox and Chrome on Linux.
export function useNativeShare() {
  const [canShare, setCanShare] = useState(false)

  useEffect(() => {
    setCanShare(typeof navigator.share === 'function')
  }, [])

  const share = useCallback(async (data: ShareData) => {
    try {
      await navigator.share(data)
    } catch (err) {
      // AbortError: the person closed the sheet. InvalidStateError: one is already open.
      const name = (err as DOMException)?.name
      if (name !== 'AbortError' && name !== 'InvalidStateError') setCanShare(false)
    }
  }, [])

  return { canShare, share }
}
