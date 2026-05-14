import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { type SearchStore, useSearchStore } from "@/entities/location"
import { useSearchActions } from "../../model/useSearchActions"
import { SearchError } from "../SearchError"

// --- 1. mocks ---
vi.mock("@/entities/location", () => ({
  useSearchStore: vi.fn(),
}))

vi.mock("../../model/useSearchActions", () => ({
  useSearchActions: vi.fn(),
}))

vi.mock("@/shared/ui/CommonIcon", () => ({
  CommonIcon: () => <div data-testid="icon-retry" />,
}))

// --- 2. tests ---
describe("SearchError", () => {
  const lastValidatedCity = { city: "Warsaw", lat: 10, lon: 20 }
  const searchSelectedCity = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()

    vi.mocked(useSearchStore).mockImplementation((s) =>
      s({
        lastValidatedCity,
      } as SearchStore),
    )

    vi.mocked(useSearchActions).mockReturnValue({
      searchSelectedCity,
    } as unknown as ReturnType<typeof useSearchActions>)
  })

  it("should render error message correctly", () => {
    render(<SearchError message="Warsaw" />)

    expect(screen.getByText("City Warsaw not found...")).toBeInTheDocument()
    expect(screen.getByText("Go back")).toBeInTheDocument()
  })

  it("should call searchSelectedCity with lastValidatedCity on click", async () => {
    render(<SearchError message="Unknown" />)

    const button = screen.getByRole("button")
    await userEvent.setup().click(button)
    expect(searchSelectedCity).toHaveBeenCalledWith(lastValidatedCity)
  })
})
