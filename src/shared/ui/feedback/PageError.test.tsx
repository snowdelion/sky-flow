import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PageError } from "./PageError";

// --- 1. mocks ---
vi.mock("@/shared/ui/CommonIcon", () => ({
  CommonIcon: () => <div data-testid="retry-icon" />,
}));

// --- 2. tests ---
describe("PageError", () => {
  it("should render custom error message", () => {
    const error = new Error("Custom error");
    render(<PageError message={error.message} reset={vi.fn()} />);

    expect(screen.getByText("Custom error")).toBeInTheDocument();
    expect(screen.getByText(/try again/i)).toBeInTheDocument();
  });

  it("should render default message when error has no message", () => {
    render(<PageError reset={vi.fn()} />);

    expect(screen.getByText("Unexpected error...")).toBeInTheDocument();
  });

  it("should call reset function on 'Try again' click", async () => {
    const reset = vi.fn();
    const error = new Error("Error");
    render(<PageError message={error.message} reset={reset} />);

    const button = screen.getByRole("button", { name: /try again/i });
    await userEvent.setup().click(button);
    expect(reset).toHaveBeenCalledTimes(1);
  });
});
