import { CloudMoonIcon } from "../../ui/icons/CloudMoonIcon";

import UnitsSettings from "./UnitsSettings";

export default function Header() {
  return (
    <header
      className="flex justify-between items-center 
        mx-auto px-3.75 w-full max-w-106.75 mt-6
        sm:px-3.5 sm:max-w-full
        md:px-5.5
        lg:px-7.75 lg:max-w-full
        xl:px-0 xl:max-w-304.5"
    >
      <div className="flex items-center gap-2.5">
        <CloudMoonIcon className="w-10 h-10 sm:w-12 sm:h-12" />

        <div className="relative mt-0.75">
          <span className="text-2xl sm:text-3xl font-bold tracking-widest select-none bg-linear-to-r from-[#E2E8F0] to-[#3B82F6]/90 bg-clip-text text-transparent">
            SkyFlow
          </span>
          <div className="absolute bottom-px w-full h-px bg-linear-to-r from-[#F0F9FF] to-[#3B82F6]/50" />
        </div>
      </div>

      <UnitsSettings />
    </header>
  );
}
