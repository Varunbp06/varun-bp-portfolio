import { cn } from '../lib/utils';

export function AnimatedGradientBadge({ children }) {
  return (
    <div className="group relative inline-flex items-center justify-center gap-2 rounded-full border border-cyan-200 px-4 py-1.5 shadow-[inset_0_-2px_6px_rgba(6,182,212,0.15)] transition-shadow duration-500 ease-out hover:shadow-[inset_0_-3px_8px_rgba(6,182,212,0.25)] dark:border-transparent dark:shadow-[inset_0_-8px_10px_#8fdfff1f] dark:hover:shadow-[inset_0_-5px_10px_#8fdfff3f]">
      <span
        className={cn(
          'animate-gradient-bg absolute inset-0 block h-full w-full rounded-[inherit] bg-gradient-to-r from-[#4079ff]/50 via-[#40ffdc]/60 to-[#4079ff]/50 p-[1px]'
        )}
        style={{
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'destination-out',
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'subtract',
          WebkitClipPath: 'padding-box',
        }}
      />
      <span className="text-sm font-medium text-slate-800 dark:text-white">✨ {children}</span>
    </div>
  );
}