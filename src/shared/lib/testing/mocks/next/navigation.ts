export const createMockNavigation = () => {
  const mockPush = vi.fn();
  const mockReplace = vi.fn();
  const mockPrefetch = vi.fn();
  const mockBack = vi.fn();

  return {
    mockPush,
    mockReplace,
    mockPrefetch,
    mockBack,

    routerModule: () => ({
      push: mockPush,
      replace: mockReplace,
      prefetch: mockPrefetch,
      back: mockBack,
    }),
    pathnameModule: { usePathname: () => "/" },
    searchParamsModule: { useSearchParams: () => new URLSearchParams() },
    redirectModule: { redirect: vi.fn() },
  };
};
