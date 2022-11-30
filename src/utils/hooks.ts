import Emitter from 'eventemitter3'
import React, { useEffect } from 'react'

import ScrollContext from '../pages/scrollContext'

export function useBoxTrack(ref: React.RefObject<HTMLElement> | undefined) {
  const [pos, setPos] = React.useState<DOMRect | null>(null)
  const scrollEmitter = React.useContext(ScrollContext)

  React.useEffect(() => {
    if (!ref || !ref.current) return
    if (
      !pos ||
      JSON.stringify(pos) !==
        JSON.stringify(ref.current.getBoundingClientRect())
    )
      setPos(ref.current.getBoundingClientRect())
    const onScroll = () => {
      if (!ref.current || !pos) return
      const box = ref.current.getBoundingClientRect()
      if (box.x !== pos.x || box.y !== pos.y) setPos(box)
    }
    scrollEmitter.on('scroll', onScroll)
    return () => {
      scrollEmitter.off('scroll', onScroll)
    }
  })

  return pos
}

export function useScrollEmitter(scrollRef: React.RefObject<HTMLElement>) {
  const [scrollEmitter] = React.useState(new Emitter())
  React.useEffect(() => {
    let last_known_scroll_position: number
    let ticking: boolean
    const onScroll = (e: Event) => {
      last_known_scroll_position = (e.target as HTMLElement).scrollTop

      if (!ticking) {
        window.requestAnimationFrame(function () {
          scrollEmitter.emit('scroll', last_known_scroll_position)
          ticking = false
        })

        ticking = true
      }
    }

    const current = scrollRef.current
    current?.addEventListener('scroll', onScroll)
    return () => current?.removeEventListener('scroll', onScroll)
  })
  return scrollEmitter
}

export function useOnClickOutside(
  ref: React.RefObject<HTMLElement>,
  handler: (e: any) => void,
  exceptionRef?: React.RefObject<HTMLElement>,
) {
  useEffect(() => {
    const listener = (event: any) => {
      if (
        !ref.current ||
        ref.current.contains(event.target) ||
        exceptionRef?.current?.contains(event.target)
      ) {
        return
      }
      handler(event)
    }
    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)

    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [ref, handler])
}
