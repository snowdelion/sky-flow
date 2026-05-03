import { SparklesIcon } from "@/shared/ui";

export function MoreDetailsAiButton({ open }: { open: boolean }) {
  return (
    <div
      className={`flex items-center gap-1.5 hover:cursor-pointer group transition-all
         backdrop-blur-md border border-white/10 bg-white/5 hover:border-white/30 active:border-white/40 active:bg-white/15
         rounded-2xl px-4 py-1.5 ${open ? "border-white/40 bg-white/15" : "border-white/10 bg-white/5"}`}
    >
      <span className="text-white font-medium group-hover:text-white transition-all duration-200">
        More details
      </span>

      <SparklesIcon
        className="transition-transform duration-200
          group-hover:[--s1:#818cf8] group-hover:[--s2:#fc28f2] group-hover:scale-105"
        size={20}
        stop1="#6366f1"
        stop2="#ec4899"
      />
    </div>
  );
}
