import { CloudMoonIcon } from "../icons/CloudMoonIcon";

import UnitsSettings from "./UnitsSettings";

export default function HeaderSection() {
  return (
    <header className="flex justify-between items-center max-w-374 mx-auto px-4 md:px-19 lg:px-35 mt-6 md:mt-10">
      <div className="flex items-center gap-2.5">
        <CloudMoonIcon className="w-12 h-12" />

        <div className="relative mt-0.75">
          <span className="text-3xl font-bold tracking-widest select-none bg-linear-to-r from-[#E2E8F0] to-[#3B82F6]/90 bg-clip-text text-transparent">
            SkyFlow
          </span>
          <div className="absolute bottom-px w-full h-px bg-linear-to-r from-[#F0F9FF] to-[#3B82F6]/50" />
        </div>
      </div>

      <UnitsSettings />
    </header>
  );
}
