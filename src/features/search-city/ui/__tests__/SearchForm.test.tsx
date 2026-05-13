import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { fireEvent, render, screen } from "@testing-library/react"
import { SearchForm } from "../SearchForm"

// --- 1. mocks ---
const handleSubmit = vi.fn((e) => e.preventDefault)
vi.mock("../../model/useSearchHandlers", () => ({
  useSearchHandlers: vi.fn(() => ({
    handleSubmit,
  })),
}))

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: vi.fn(),
}))

// --- 2. tests ---
describe("SearchForm", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should call handleSubmit when form is submitted", () => {
    renderWithClient(<SearchForm isError={false} />)

    const form = screen.getByRole("form")

    fireEvent.submit(form)

    expect(handleSubmit).toHaveBeenCalled()
  })

  it("should apply error classes when isError is true", () => {
    renderWithClient(<SearchForm isError={true} />)

    const input = screen.getByRole("group")
    expect(input).toHaveClass("ring-red-500/50")
  })
})

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
