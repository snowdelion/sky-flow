import { useEffect } from "react"

export function usePreventScroll(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const element = ref.current
    if (!element) return

    const original = element.focus.bind(element)
    element.focus = (options?: FocusOptions) => original({ ...options, preventScroll: true })

    return () => {
      element.focus = original
    }
  }, [ref])
}
