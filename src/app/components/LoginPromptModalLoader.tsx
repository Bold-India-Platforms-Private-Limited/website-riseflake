'use client'

/**
 * Client Component wrapper so that next/dynamic with ssr:false can be used.
 * next/dynamic({ ssr: false }) is only allowed inside Client Components;
 * page.tsx files are Server Components and cannot call it directly.
 *
 * SEO: because this is a Client Component and the inner modal is loaded with
 * ssr:false, the modal HTML never appears in the server response.
 */

import dynamic from 'next/dynamic'

const LoginPromptModal = dynamic(
  () => import('./LoginPromptModal'),
  { ssr: false }
)

export default function LoginPromptModalLoader() {
  return <LoginPromptModal />
}
