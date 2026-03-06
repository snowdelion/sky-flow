import type { Mock } from "vitest";

export const createMockNavigation = (): NavigationMocks => {
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

export interface NavigationMocks {
  mockPush: Mock;
  mockReplace: Mock;
  mockPrefetch: Mock;
  mockBack: Mock;
  routerModule: () => {
    push: Mock;
    replace: Mock;
    prefetch: Mock;
    back: Mock;
  };
  pathnameModule: {
    usePathname: () => string;
  };
  searchParamsModule: {
    useSearchParams: () => URLSearchParams;
  };
  redirectModule: {
    redirect: Mock;
  };
}
