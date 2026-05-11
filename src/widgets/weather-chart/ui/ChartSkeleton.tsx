import { getAspect } from "../lib/chart.utils";

export function ChartSkeleton({
  isMobile,
  isTablet,
}: {
  isMobile?: boolean;
  isTablet?: boolean;
}) {
  const aspect = getAspect(isMobile, isTablet) ?? 21 / 16;

  return (
    <div className="relative flex flex-col gap-5 w-full max-w-100 sm:max-w-184 md:max-w-full xl:max-w-304 mx-auto bg-[hsl(243,27%,20%)] px-4 pb-4 pt-2 rounded-xl border border-white/10 items-center animate-pulse">
      <ul className="flex justify-between w-full items-center mt-5">
        <li className="flex-1 flex justify-center">
          <div className="h-8 w-20 sm:h-10 sm:w-30 bg-white/10 rounded-md" />
        </li>
        <li className="flex-1 flex justify-center">
          <div className="h-8 w-20 sm:h-10 sm:w-30 bg-white/10 rounded-md" />
        </li>
      </ul>

      <div
        className="relative w-full"
        style={{ aspectRatio: `${aspect} / 1`, minHeight: "200px" }}
      >
        <div className="absolute inset-0 flex flex-col justify-between py-6">
          <div
            className="absolute bottom-10 left-0 right-0 h-2/3 bg-linear-to-t from-blue-500/10 to-transparent"
            style={{
              clipPath:
                "polygon(0% 100%, 0% 40%, 25% 30%, 50% 60%, 75% 25%, 100% 45%, 100% 100%)",
            }}
          />

          <div className="flex justify-between mt-auto px-0">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-3 w-8 sm:w-12 bg-white/10 rounded" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
