import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, render, screen, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import { useSettingsStore } from "@/stores/useSettingsStore";

import UnitsSettings from "./UnitsSettings";

// --- 1. mocks ---
vi.mock("next/image", async () => {
  const actual = await vi.importActual("@/testing/mocks/next/image");
  return { default: actual.default };
});

// --- 2. setup ---
const setup = () => {
  const result = renderWithClient(<UnitsSettings />);
  const user = userEvent.setup();

  const openMenu = async () => {
    const button = screen.getByRole("button", { name: /units/i });
    await user.click(button);
  };

  return {
    ...result,
    user,
    openMenu,
    getOption: (name: RegExp) => screen.findByRole("menuitem", { name }),
    getCheckedIcon: (element: HTMLElement) =>
      within(element).findByAltText(/checked/i),
  };
};

// --- 3. tests ---
describe("UnitsSettings integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useSettingsStore.getState().reset();
  });

  it("should change first to second value", async () => {
    const { openMenu, getOption, user, getCheckedIcon } = setup();

    await openMenu();

    const optionFah = await getOption(/fahrenheit/i);
    await user.click(optionFah);
    expect(useSettingsStore.getState().units.temperature).toBe("fahrenheit");

    const optionCel = await getOption(/celsius/i);
    await user.click(optionCel);
    expect(useSettingsStore.getState().units.temperature).toBe("celsius");

    const checkedIcon = await getCheckedIcon(optionCel);
    expect(checkedIcon).toBeInTheDocument();
  });

  it("should change to default", async () => {
    const { openMenu, getOption, user } = setup();
    act(() =>
      useSettingsStore.setState({
        units: {
          temperature: "fahrenheit",
          speed: "mph",
          precipitation: "inch",
          time: "24",
        },
      }),
    );

    await openMenu();

    const defaultOption = await getOption(/default option/i);
    await user.click(defaultOption);

    expect(useSettingsStore.getState().units.temperature).toBe("celsius");
    expect(useSettingsStore.getState().units.speed).toBe("kmh");
    expect(useSettingsStore.getState().units.precipitation).toBe("mm");
    expect(useSettingsStore.getState().units.time).toBe("12");
  });
});

// --- 4. render with client ---
const renderWithClient = (element: React.ReactElement) => {
  const testQueryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={testQueryClient}>
      {children}
    </QueryClientProvider>
  );

  return render(element, { wrapper });
};
