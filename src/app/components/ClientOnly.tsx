'use client'

import dynamic from 'next/dynamic'

// UTM capture — client-only, zero SSR impact, invisible to crawlers.
// next/dynamic with ssr:false is only allowed inside a Client Component,
// so this thin wrapper exists solely to satisfy that constraint.
const UTMCapture = dynamic(() => import('./UTMCapture'), { ssr: false })
const LoginPromptModal = dynamic(() => import('./LoginPromptModal'), { ssr: false })

export default function ClientOnly() {
  return (
    <>
      <UTMCapture />
      <LoginPromptModal />
    </>
  )
}
