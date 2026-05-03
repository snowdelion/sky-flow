import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { ChevronLeft } from "lucide-react";
import type { RequestData } from "../model/types";
import { useAiDescription } from "../model/useAiDescription";
import { MoreDetailsAiButton } from "./MoreDetailsAiButton";

export function AiDescriptionMenu({
  aiRequestData,
}: {
  aiRequestData: RequestData | null;
}) {
  const {
    selectedTab,
    handleTabSelect,
    setSelectedTab,
    completion,
    isLoading,
    error,
  } = useAiDescription(aiRequestData);

  return (
    <Menu as="div" className="relative flex justify-center">
      <MenuButton className="focus:outline-none">
        {({ open }) => <MoreDetailsAiButton open={open} />}
      </MenuButton>

      <Transition
        enter="transition duration-75 ease-out"
        enterFrom="scale-95 opacity-0 -translate-y-2"
        enterTo="scale-100 opacity-100 translate-y-0"
        leave="transition duration-75 ease-out"
        leaveFrom="scale-100 opacity-100 translate-y-0"
        leaveTo="scale-95 opacity-0 -translate-y-2"
      >
        <MenuItems
          modal={false}
          className={`absolute top-9 sm:left-0 z-50 mt-2 flex items-center gap-4 px-6 py-3
                     bg-[#818cf8]/30 backdrop-blur-md border border-white/10
                     rounded-2xl shadow-2xl focus:outline-none custom-scrollbar ${
                       selectedTab ? "min-w-80 sm:min-w-100" : ""
                     }`}
        >
          {!selectedTab ? (
            <div className="flex items-center gap-4">
              <MenuItem as="div">
                {() => (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleTabSelect("location");
                    }}
                    className="relative text-lg font-semibold transition-all duration-200 outline-none group"
                  >
                    <span className="transition-opacity duration-200 opacity-100 group-hover:opacity-0">
                      Location
                    </span>
                    <span className="absolute inset-0 transition-opacity duration-200 from-amber-500 to-yellow-200 bg-linear-to-r bg-clip-text text-transparent opacity-0 group-hover:opacity-100">
                      Location
                    </span>
                  </button>
                )}
              </MenuItem>
              <div className="w-px h-5 bg-white/10" />
              <MenuItem>
                {() => (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleTabSelect("weather");
                    }}
                    className="relative text-lg font-semibold transition-all duration-200 outline-none group"
                  >
                    <span className="transition-opacity duration-200 opacity-100 group-hover:opacity-0">
                      Weather
                    </span>
                    <span className="absolute inset-0 transition-opacity duration-200 from-[#ccfbf1] to-[#22d3ee] bg-linear-to-r bg-clip-text text-transparent opacity-0 group-hover:opacity-100">
                      Weather
                    </span>
                  </button>
                )}
              </MenuItem>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <button
                className="flex items-center gap-2 text-white/50 hover:text-white transition-colors cursor-pointer"
                onClick={() => setSelectedTab(null)}
              >
                <ChevronLeft size={18} />
                <span className="text-xs uppercase tracking-wider font-bold">
                  Back
                </span>
              </button>

              {isLoading && !completion && (
                <div className="flex items-center gap-2 text-white/70">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce" />
                  </div>
                  <span className="text-sm italic">AI is thinking...</span>
                </div>
              )}

              {completion && (
                <p className="text-sm leading-relaxed text-white/90">
                  {completion}
                </p>
              )}

              {error && (
                <p className="text-sm text-red-400/90 bg-red-400/10 p-2 rounded-lg">
                  {error.message}
                </p>
              )}
            </div>
          )}
        </MenuItems>
      </Transition>
    </Menu>
  );
}
