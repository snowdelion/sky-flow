import { useCompletion } from "@ai-sdk/react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AiDescriptionMenu } from "./AiDescriptionMenu";

// --- 1. mocks ---
vi.mock("@ai-sdk/react", () => ({
  useCompletion: vi.fn(() => ({
    completion: "",
    complete: vi.fn(),
    isLoading: false,
    error: undefined,
    stop: vi.fn(),
  })),
}));

// --- 2. setup ---
const setup = () => {
  const user = userEvent.setup();
  const aiRequestData = {
    city: "Warsaw",
    country: "Poland",
    region: "Masovian",
    lat: 52,
    lon: 21,
    temperature: 10,
    condition: "sunny",
  };
  render(<AiDescriptionMenu aiRequestData={aiRequestData} />);

  return {
    user,
    openMenu: async () => await user.click(screen.getByRole("button")),
    findMenuButton: async (text: RegExp) => {
      const element = await screen.findAllByText(text);
      return element[0];
    },
  };
};

const mockUseCompletion = (overrides = {}) =>
  vi.mocked(useCompletion).mockReturnValue({
    completion: "",
    complete: vi.fn(),
    isLoading: false,
    error: undefined,
    stop: vi.fn(),
    ...overrides,
  } as unknown as ReturnType<typeof useCompletion>);

// --- 3. tests ---
describe("AiDescriptionMenu", () => {
  it("should open menu and show options", async () => {
    const { openMenu, findMenuButton } = setup();

    await openMenu();
    expect(await findMenuButton(/location/i)).toBeDefined();
    expect(await findMenuButton(/weather/i)).toBeDefined();
  });

  it("should display a description of the location when 'Location' is clicked", async () => {
    mockUseCompletion({ completion: "Warsaw is a great city" });
    const { user, openMenu, findMenuButton } = setup();

    await openMenu();

    const locationButton = await findMenuButton(/location/i);
    await user.click(locationButton);

    expect(await screen.findByText(/warsaw/i)).toBeDefined();
    expect(await screen.findByText(/back/i)).toBeDefined();
  });

  it("should return to tab selection when 'Back' button is clicked", async () => {
    const { user, openMenu, findMenuButton } = setup();

    await openMenu();

    const weatherButton = await findMenuButton(/weather/i);
    await user.click(weatherButton);

    const backButton = await screen.findByText(/back/i);
    await user.click(backButton);

    expect(await findMenuButton(/location/i)).toBeDefined();
  });

  it("should show 'Too many requests' on 429 error", async () => {
    mockUseCompletion({ error: new Error("429 Too many requests") });
    const { user, openMenu, findMenuButton } = setup();
    await openMenu();
    await user.click(await findMenuButton(/weather/i));

    expect(await screen.findByText(/too many requests/i)).toBeDefined();
    expect(screen.queryByText(/ai service is unavailable/i)).toBeNull();
  });

  it("should show generic error when error is not 429", async () => {
    mockUseCompletion({ error: new Error("Internal server error") });
    const { user, openMenu, findMenuButton } = setup();
    await openMenu();
    await user.click(await findMenuButton(/weather/i));

    expect(await screen.findByText(/ai service is unavailable/i)).toBeDefined();
    expect(screen.queryByText(/too many requests/i)).toBeNull();
  });
});
