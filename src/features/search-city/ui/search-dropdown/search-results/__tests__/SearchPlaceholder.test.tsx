import { createEvent, fireEvent, render, screen } from "@testing-library/react";
import { SearchPlaceholder } from "../SearchPlaceholder";

// --- 1. mocks ---
vi.mock("@/shared/ui", () => ({
  SearchIcon: () => <div data-testid="search-icon" />,
  FailedSearchIcon: () => <div data-testid="failed-search-icon" />,
}));

// --- 2. tests ---
describe("SearchPlaceholder", () => {
  it("should show message to type more chars when input length is 1", () => {
    render(<SearchPlaceholder inputValue="1" isError={false} />);

    expect(screen.getByText(/type at least 2 characters/i)).toBeInTheDocument();
    expect(screen.getByTestId("search-icon")).toBeInTheDocument();
  });

  it("should show 'not found' with city name when input length between 2-50", () => {
    render(<SearchPlaceholder inputValue="Warsaw" isError={false} />);

    expect(screen.getByText(/city warsaw not found!/i)).toBeInTheDocument();
    expect(screen.getByTestId("failed-search-icon")).toBeInTheDocument();
  });

  it("should show static 'not found' when input length > 50", () => {
    const input = "1".repeat(51);
    render(<SearchPlaceholder inputValue={input} isError={false} />);

    expect(screen.getByText(/city not found!/i)).toBeInTheDocument();
    expect(screen.queryByText(input)).not.toBeInTheDocument();
  });

  it("should prevent default on mousedown", () => {
    render(<SearchPlaceholder inputValue="1" isError={false} />);

    const container = screen.getByRole("listbox");
    const event = createEvent.mouseDown(container);

    fireEvent(container, event);
    expect(event.defaultPrevented).toBe(true);
  });
});
