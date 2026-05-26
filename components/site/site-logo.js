import Image from 'next/image'

export default function SiteLogo({ compact = false, light = false }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <Image
        src="/images/beat-drops-mark.svg"
        alt=""
        width={compact ? 58 : 76}
        height={compact ? 58 : 76}
        priority
        className={`${compact ? 'h-12 w-12 sm:h-14 sm:w-14' : 'h-16 w-16'} rounded-2xl object-contain ${light ? 'bg-ivory/95 shadow-soft' : ''}`}
      />
      <div className="min-w-0">
        <p className={`${compact ? 'text-2xl sm:text-[1.85rem]' : 'text-4xl'} truncate font-display font-semibold leading-none tracking-[-0.03em] ${light ? 'text-white' : 'text-ink-900'}`}>
          Beat <span className="text-maroon-700">Drops</span>
        </p>
        <p className={`${compact ? 'text-[11px] sm:text-xs' : 'text-sm'} mt-1 truncate font-semibold uppercase tracking-[0.12em] ${light ? 'text-gold-100' : 'text-ink-500'}`}>
          Music Academy · Bhubaneswar
        </p>
      </div>
    </div>
  )
}
