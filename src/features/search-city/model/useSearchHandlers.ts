import { RefObject, useCallback, useMemo } from "react";
import { useSearchStore, type ActiveTab } from "@/entities/location";
import { useSearchActions } from "./useSearchActions";

export function useSearchHandlers() {
  const setInputValue = useSearchStore((s) => s.setInputValue);
  const setCurrentTab = useSearchStore((s) => s.setCurrentTab);
  const inputValue = useSearchStore((s) => s.inputValue);
  const setIsOpen = useSearchStore((s) => s.setIsOpen);

  const { searchCityWithName } = useSearchActions();

  const handleChangeTab = useCallback(
    (value: ActiveTab) => {
      setCurrentTab(value);
    },
    [setCurrentTab],
  );

  const handleKeydown = useCallback(
    (
      e: React.KeyboardEvent<HTMLInputElement>,
      inputRef: RefObject<HTMLInputElement | null>,
    ) => {
      if (e.key === "Enter") {
        searchCityWithName(inputValue);
        inputRef?.current?.blur();
        setIsOpen(false);
        setInputValue("");
      }

      if (e.key === "Escape") {
        setIsOpen(false);
        if (inputRef.current) inputRef.current.blur();
      }
    },
    [inputValue, searchCityWithName, setIsOpen, setInputValue],
  );

  const handleChangeInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
      setIsOpen(true);
    },
    [setIsOpen, setInputValue],
  );

  const handleSubmit = useCallback(
    (e: React.SubmitEvent<HTMLFormElement>) => {
      e.preventDefault();
      searchCityWithName(inputValue);
    },
    [searchCityWithName, inputValue],
  );

  return useMemo(
    () => ({
      handleChangeTab,
      handleKeydown,
      handleChangeInput,
      handleSubmit,
    }),
    [handleChangeTab, handleKeydown, handleChangeInput, handleSubmit],
  );
}
