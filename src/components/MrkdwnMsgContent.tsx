import { Marked } from '@ts-stack/markdown'
import { useEffect, useRef } from 'react'

type Props = { content: string; isAssistant?: boolean }

/** For printing content with interleaved JSON codeblocks (denoted with Markdown Syntax). */
export default function MrkdwnMsgContent({
  content,
  isAssistant = false,
}: Props) {
  const parsed = Marked.parse(content)
  const innerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!innerRef.current || !isAssistant) return

    const firstp = innerRef.current.querySelector('p')
    if (firstp) firstp.innerText = '🤖 ' + firstp.innerText
  }, [innerRef, isAssistant])

  return <div ref={innerRef} dangerouslySetInnerHTML={{ __html: parsed }}></div>
}
