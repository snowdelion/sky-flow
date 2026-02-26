import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, render, screen, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import { useSettingsStore } from "@/stores/useSettingsStore";

import UnitsSettings from "./UnitsSettings";

import "@testing-library/jest-dom/vitest";

vi.mock("next/image", () => ({
  default: (props: Partial<React.ImgHTMLAttributes<HTMLImageElement>>) => (
    <img
      {...props}
      alt={props.alt}
      src={props.src}
      width={props.width}
      height={props.height}
    />
  ),
}));

const mockFetchWeatherData = vi.hoisted(() => vi.fn());
vi.mock("@/services/fetchWeatherData", () => ({
  fetchWeatherData: mockFetchWeatherData,
}));

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

describe("UnitsSettings integration", () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    vi.clearAllMocks();

    user = userEvent.setup();
  });

  it("should change first to second value", async () => {
    renderWithClient(<UnitsSettings />);
    const button = screen.getByRole("button", { name: /units/i });

    await user.click(button);

    const optionF = await screen.findByRole("menuitem", {
      name: /fahrenheit option/i,
    });

    await user.click(optionF);
    expect(useSettingsStore.getState().units.temperature).toBe("fahrenheit");

    const optionC = await screen.findByRole("menuitem", {
      name: /celsius option/i,
    });
    await user.click(optionC);
    expect(useSettingsStore.getState().units.temperature).toBe("celsius");

    const checkedIcon = within(optionC).getByAltText(/checked/i);
    expect(checkedIcon).toBeInTheDocument();
  });

  it("should change to default", async () => {
    renderWithClient(<UnitsSettings />);
    act(() =>
      useSettingsStore.setState({
        units: {
          temperature: "fahrenheit",
          speed: "mph",
          precipitation: "inch",
        },
      }),
    );

    const menu = screen.getByRole("button", { name: /units/i });
    await user.click(menu);

    const option = await screen.findByRole("menuitem", {
      name: /default option/i,
    });

    await user.click(option);

    expect(useSettingsStore.getState().units.temperature).toBe("celsius");
    expect(useSettingsStore.getState().units.speed).toBe("kmh");
    expect(useSettingsStore.getState().units.precipitation).toBe("mm");
  });
});
