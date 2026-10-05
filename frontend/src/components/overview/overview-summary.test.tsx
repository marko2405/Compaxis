import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { OverviewSummary } from "./overview-summary";

describe("OverviewSummary", () => {
  it("renders the selected season snapshot", () => {
    render(
      <OverviewSummary
        leaderName="Olympiacos Piraeus"
        playerCount={208}
        season="2025/26"
        teamCount={20}
      />,
    );

    expect(screen.getByText("208")).toBeInTheDocument();
    expect(screen.getByText("20")).toBeInTheDocument();
    expect(screen.getByText("2025/26")).toBeInTheDocument();
    expect(screen.getByText("Olympiacos Piraeus")).toBeInTheDocument();
  });

  it("shows unavailable values without inventing data", () => {
    render(
      <OverviewSummary
        leaderName={null}
        playerCount={null}
        season="2023/24"
        teamCount={null}
      />,
    );

    expect(screen.getAllByText("Unavailable")).toHaveLength(3);
  });
});
