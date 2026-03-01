import { render, screen } from "@testing-library/react";

import { HourDisplay } from "./HourDisplay";

describe("hourly-utils", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render correct 12-hour format", () => {
    render(<HourDisplay hourItem="2 PM" hourFormat="12" />);

    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("PM")).toBeInTheDocument();
    expect(screen.getByText("PM")).toHaveClass("text-white/50");
  });

  it("should render correct 24-hour format", () => {
    render(<HourDisplay hourItem="08:00" hourFormat="24" />);

    expect(screen.getByText("8")).toBeInTheDocument();
    expect(screen.getByText(":")).toBeInTheDocument();
    expect(screen.getByText("00")).toBeInTheDocument();
    expect(screen.getByText("00")).toHaveClass("text-white/50");
  });
});
