import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { createRef } from "react"
import { useSearchStore } from "@/entities/location"
import { useSearchActions } from "../../model/useSearchActions"
import { SearchBar } from "./SearchBar"

// --- 1. mocks ---
vi.mock("../../../model/useSearchActions", () => ({
  useSearchActions: vi.fn(() => ({
    searchCityWithName: vi.fn(),
  })),
}))

vi.mock("../../model/useSearchActions", () => ({
  useSearchActions: vi.fn(),
}))

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: vi.fn(),
}))

// --- 2. tests ---
describe("SearchBar", () => {
  const inputRef = createRef<HTMLInputElement>()
  const user = userEvent.setup()

  beforeEach(() => {
    vi.clearAllMocks()
    useSearchStore.getState().reset()
  })

  it("should call searchCityWithName when search icon is clicked", async () => {
    const searchCityWithName = vi.fn()
    vi.mocked(useSearchActions).mockReturnValue({
      searchCityWithName,
    } as unknown as ReturnType<typeof useSearchActions>)
    useSearchStore.setState({ inputValue: "Warsaw" })
    renderWithClient(<SearchBar inputRef={inputRef} isError={false} />)

    const searchIcon = screen.getByAltText(/search/i)
    await user.click(searchIcon)

    expect(searchCityWithName).toHaveBeenCalledWith("Warsaw")
  })

  it("should show clear button when input isn't empty and clear on click", async () => {
    useSearchStore.setState({ inputValue: "Warsaw" })
    renderWithClient(<SearchBar inputRef={inputRef} isError={false} />)

    const clearButton = screen.getByRole("button")
    expect(clearButton).toBeInTheDocument()

    await user.click(clearButton)
    expect(useSearchStore.getState().inputValue).toBe("")
  })

  it("shouldn't show clear button when input is empty", () => {
    useSearchStore.setState({ inputValue: "" })
    renderWithClient(<SearchBar inputRef={inputRef} isError={false} />)

    const clearButton = screen.queryByRole("button")
    expect(clearButton).not.toBeInTheDocument()
  })

  it("should display error placeholder when isError is true", () => {
    renderWithClient(<SearchBar inputRef={inputRef} isError={true} />)

    expect(screen.getByPlaceholderText(/something went wrong/i)).toBeInTheDocument()
  })
})

// --- 3. renderWithClient with client ---
const testQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
})

const renderWithClient = (element: React.ReactElement) => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={testQueryClient}>{children}</QueryClientProvider>
  )
  return render(element, { wrapper })
}
