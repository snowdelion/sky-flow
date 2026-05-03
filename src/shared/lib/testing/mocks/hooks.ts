export const createMockHooks = () => {
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
