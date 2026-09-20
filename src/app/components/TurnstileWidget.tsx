'use client'

import { forwardRef, useImperativeHandle, useRef } from 'react'
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile'

export type TurnstileWidgetHandle = {
  reset: () => void
}

type Props = {
  onVerify: (token: string) => void
  onExpire?: () => void
  onError?: () => void
  size?: 'normal' | 'compact' | 'flexible'
}

const TurnstileWidget = forwardRef<TurnstileWidgetHandle, Props>(function TurnstileWidget(
  { onVerify, onExpire, onError, size = 'flexible' },
  ref
) {
  const innerRef = useRef<TurnstileInstance>(null)

  useImperativeHandle(ref, () => ({
    reset: () => innerRef.current?.reset(),
  }))

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

  if (!siteKey) return null

  return (
    <div className="my-1 flex justify-center [&_iframe]:max-w-full">
      <Turnstile
        ref={innerRef}
        siteKey={siteKey}
        options={{ theme: 'light', size, language: 'auto' }}
        onSuccess={onVerify}
        onExpire={() => onExpire?.()}
        onError={() => onError?.()}
      />
    </div>
  )
})

export default TurnstileWidget
