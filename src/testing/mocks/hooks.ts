import type { Mock } from "vitest";

export const createMockHooks = (): HookMocks => {
  const mockAddCity = vi.fn();
  const mockToggleFavorites = vi.fn();
  const removeCity = vi.fn();

  return {
    mockAddCity,
    mockToggleFavorites,
    removeCity,

    historyModule: {
      useSearchHistory: () => ({
        addCity: mockAddCity,
        toggleFavorites: mockToggleFavorites,
        removeCity: removeCity,
        recent: [],
        favorites: [],
      }),
    },
  };
};

export interface HookMocks {
  mockAddCity: Mock;
  mockToggleFavorites: Mock;
  removeCity: Mock;
  historyModule: {
    useSearchHistory: () => {
      addCity: Mock;
      toggleFavorites: Mock;
      removeCity: Mock;
      recent: never[];
      favorites: never[];
    };
  };
}
