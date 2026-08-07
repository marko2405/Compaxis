const SEASON_CODE_PATTERN = /^E(\d{4})$/;

export function formatSeasonCode(seasonCode: string): string {
  const match = SEASON_CODE_PATTERN.exec(seasonCode);

  if (!match) {
    return seasonCode;
  }

  const startYear = Number(match[1]);
  return `${startYear}/${startYear + 1}`;
}
