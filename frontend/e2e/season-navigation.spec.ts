import { expect, test } from "@playwright/test";

test("keeps the selected season across primary pages", async ({ page }) => {
  await page.goto("/");

  const seasonSelector = page.getByLabel("Season");
  await expect(seasonSelector).toBeVisible();
  await seasonSelector.press("ArrowDown");
  const options = page.getByRole("option");
  await expect(options.first()).toBeVisible();
  const optionCount = await options.count();
  expect(optionCount).toBeGreaterThan(1);
  const targetOption = options.nth(optionCount - 1);
  const selectedSeason = await targetOption.getAttribute("data-value");
  expect(selectedSeason).toBeTruthy();
  await targetOption.click();

  await expect(page).toHaveURL(new RegExp(`season_code=${selectedSeason}`));

  for (const name of ["Players", "Teams", "Standings", "AI Scout"]) {
    await expect(page.getByRole("link", { name, exact: true })).toHaveAttribute(
      "href",
      new RegExp(`season_code=${selectedSeason}`),
    );
  }
});
