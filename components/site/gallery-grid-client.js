'use client'

import { useEffect, useState } from 'react'
import { Maximize2, X } from 'lucide-react'

export default function GalleryGridClient({ items, expanded = false }) {
  const [activeItem, setActiveItem] = useState(null)

  useEffect(() => {
    if (!activeItem) return undefined

    const onKeyDown = (event) => {
      if (event.key === 'Escape') setActiveItem(null)
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [activeItem])

  return (
    <>
      <div className="grid auto-rows-[180px] gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {items.map((item, index) => {
          const spanClass = expanded
            ? index % 5 === 0
              ? 'sm:col-span-2'
              : index % 4 === 0
                ? 'xl:row-span-2'
                : ''
            : index === 0
              ? 'sm:col-span-2'
              : ''

          if (item.image_url) {
            return (
              <button
                key={`${item.title}-${index}`}
                type="button"
                onClick={() => setActiveItem(item)}
                className={`surface-card group relative overflow-hidden text-left ${spanClass}`}
                aria-label={`Open ${item.title}`}
              >
                <img src={item.image_url} alt={item.title} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,14,12,0.04),rgba(20,14,12,0.74))]" />
                <span className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-maroon-800 opacity-0 shadow-soft transition group-hover:opacity-100">
                  <Maximize2 className="h-4 w-4" />
                </span>
                <div className="relative flex h-full flex-col justify-end p-5">
                  <h3 className="font-display text-2xl font-medium text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-white/80">{item.caption}</p>
                </div>
              </button>
            )
          }

          return (
            <article key={`${item.title}-${index}`} className={`surface-card group relative overflow-hidden p-6 ${spanClass}`}>
              <div
                className={`absolute inset-0 ${
                  index % 2 === 0
                    ? 'bg-[linear-gradient(135deg,rgba(200,169,106,0.22),rgba(255,255,255,0.12))]'
                    : 'bg-[linear-gradient(135deg,rgba(110,20,35,0.16),rgba(255,255,255,0.08))]'
                }`}
              />
              <div className="relative flex h-full flex-col justify-end rounded-[24px] border border-white/50 bg-white/20 p-5 backdrop-blur-[2px]">
                <h3 className="font-display text-2xl font-medium text-ink-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-7 text-ink-500">{item.caption}</p>
              </div>
            </article>
          )
        })}
      </div>

      {activeItem ? (
        <div className="fixed inset-0 z-[80] bg-ink-900/80 p-4 backdrop-blur-sm md:p-8" role="dialog" aria-modal="true" aria-label={activeItem.title}>
          <button type="button" className="absolute inset-0 cursor-default" aria-label="Close gallery preview" onClick={() => setActiveItem(null)} />
          <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-center">
            <button
              type="button"
              onClick={() => setActiveItem(null)}
              className="absolute right-0 top-0 z-[1] grid h-11 w-11 place-items-center rounded-full bg-white text-maroon-800 shadow-panel"
              aria-label="Close gallery preview"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="overflow-hidden rounded-[28px] bg-black shadow-float">
              <img src={activeItem.image_url} alt={activeItem.title} className="max-h-[78vh] w-full object-contain" />
            </div>
            <div className="mt-4 rounded-[20px] bg-white/95 px-5 py-4 shadow-soft">
              <p className="font-display text-2xl font-medium text-ink-900">{activeItem.title}</p>
              <p className="mt-1 text-sm text-ink-500">{activeItem.caption}</p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
