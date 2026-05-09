import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { useSearchStore } from "@/entities/location";
import { useSearchCity } from "../../model/useSearchCity";
import { SearchDropdown } from "./SearchDropdown";

// --- 1. mocks ---
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: vi.fn(),
}));

vi.mock("../../model/useSearchCity", () => ({
  useSearchCity: vi.fn(),
}));

vi.mock("../../model/useSearchHandlers", () => ({
  useSearchHandlers: vi.fn(() => ({
    handleChangeTab: vi.fn(),
  })),
}));

// --- 2. tests ---
describe("SearchDropdown", () => {
  const inputRef =
    createRef<HTMLInputElement> as unknown as React.RefObject<HTMLInputElement | null>;
  const dropdownRef =
    createRef<HTMLDivElement> as unknown as React.RefObject<HTMLDivElement | null>;

  beforeEach(() => {
    vi.clearAllMocks();
    useSearchStore.getState().reset();
  });

  it("shouln't renderWithClient dropdown when isOpen is false", () => {
    useSearchStore.setState({ isOpen: false });
    vi.mocked(useSearchCity).mockReturnValue({
      resultData: [],
      shouldSearchSkeleton: false,
      isError: false,
    });
    const { container } = renderWithClient(
      <SearchDropdown inputRef={inputRef} dropdownRef={dropdownRef} />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("should renderWithClient SearchTabs when inputValue is empty", () => {
    useSearchStore.setState({ isOpen: true, inputValue: "" });
    vi.mocked(useSearchCity).mockReturnValue({
      resultData: [],
      shouldSearchSkeleton: false,
      isError: false,
    });
    renderWithClient(
      <SearchDropdown inputRef={inputRef} dropdownRef={dropdownRef} />,
    );

    expect(screen.getByRole("tablist", { hidden: true })).toBeInTheDocument();
  });

  it("should renderWithClient SearchResultSkeleton when loading", () => {
    useSearchStore.setState({ isOpen: true, inputValue: "Warsaw" });
    vi.mocked(useSearchCity).mockReturnValue({
      resultData: [],
      shouldSearchSkeleton: true,
      isError: false,
    });
    renderWithClient(
      <SearchDropdown inputRef={inputRef} dropdownRef={dropdownRef} />,
    );

    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("should renderWithClient SearchResultCity list when success data", () => {
    const data = [{ id: 1, city: "Warsaw", lat: 10, lon: 20 }];
    useSearchStore.setState({ isOpen: true, inputValue: "Warsaw" });
    vi.mocked(useSearchCity).mockReturnValue({
      resultData: data,
      shouldSearchSkeleton: false,
    } as ReturnType<typeof useSearchCity>);
    renderWithClient(
      <SearchDropdown inputRef={inputRef} dropdownRef={dropdownRef} />,
    );

    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(screen.getByText("Warsaw")).toBeInTheDocument();
  });

  it("should close on Escape", async () => {
    useSearchStore.setState({ isOpen: true });
    renderWithClient(
      <SearchDropdown inputRef={inputRef} dropdownRef={dropdownRef} />,
    );

    const container = screen.getByRole("listbox").parentElement;
    container?.focus();

    await userEvent.setup().keyboard("{Escape}");
    expect(useSearchStore.getState().isOpen).toBe(false);
  });
});

// --- 3. renderWithClient with client ---
const testQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const renderWithClient = (element: React.ReactElement) => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={testQueryClient}>
      {children}
    </QueryClientProvider>
  );
  return render(element, { wrapper });
};
