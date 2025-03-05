import { useEffect, useRef, useState } from 'react'

export default function useTextarea({ initialText }: { initialText?: string }) {
  const textAreaRef = useRef<HTMLTextAreaElement>(null)
  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.focus()
    }
  }, [])
  const [text, setText] = useState(initialText ?? '')
  const [currentSelectionStart, setCurrentSelectionStart] = useState(0)
  const [currentSelectionEnd, setCurrentSelectionEnd] = useState(0)

  const readOnly = false // !user || user.username !== note?.author
  return {
    textAreaRef,
    text,
    setText,
    currentSelectionStart,
    setCurrentSelectionStart,
    currentSelectionEnd,
    setCurrentSelectionEnd,
    readOnly,
  }
}
