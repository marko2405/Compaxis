"use client";

import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useState } from "react";

import { formatSeasonCode } from "@/lib/format-season-code";
import { comparePlayers, ScoutServiceError } from "@/services/scout-service";
import type { PlayerLeaderboardEntry } from "@/types/player";
import type { ScoutComparisonResponse } from "@/types/scout";

import { ComparisonChart } from "./comparison-chart";
import { ComparisonMetrics } from "./comparison-metrics";
import { PlayerComparisonCard } from "./player-comparison-card";
import { PlayerSelector } from "./player-selector";
import { ScoutAnalysis } from "./scout-analysis";
import { ScoutLoadingState } from "./scout-loading-state";

type ScoutComparisonProps = {
  initialPlayerAId: number | null;
  initialPlayerBId: number | null;
  initialQueryError: string | null;
  players: PlayerLeaderboardEntry[];
  seasonCode: string;
};

export function ScoutComparison({
  initialPlayerAId,
  initialPlayerBId,
  initialQueryError,
  players,
  seasonCode,
}: ScoutComparisonProps) {
  const initialPlayerA = findPlayer(players, initialPlayerAId);
  const initialPlayerB = findPlayer(players, initialPlayerBId);
  const missingPlayerError = getMissingPlayerError(
    initialPlayerAId,
    initialPlayerBId,
    initialPlayerA,
    initialPlayerB,
  );
  const duplicateError =
    initialPlayerAId !== null && initialPlayerAId === initialPlayerBId
      ? "Choose two different players to compare."
      : null;
  const [playerA, setPlayerA] = useState(initialPlayerA);
  const [playerB, setPlayerB] = useState(initialPlayerB);
  const [result, setResult] = useState<ScoutComparisonResponse | null>(null);
  const [error, setError] = useState(
    initialQueryError ?? duplicateError ?? missingPlayerError,
  );
  const [isLoading, setIsLoading] = useState(false);
  const canCompare = playerA !== null && playerB !== null && playerA.player_id !== playerB.player_id;

  function updateSelection(
    slot: "playerA" | "playerB",
    player: PlayerLeaderboardEntry | null,
  ) {
    const nextA = slot === "playerA" ? player : playerA;
    const nextB = slot === "playerB" ? player : playerB;
    setPlayerA(nextA);
    setPlayerB(nextB);
    setResult(null);
    setError(
      nextA && nextB && nextA.player_id === nextB.player_id
        ? "Choose two different players to compare."
        : null,
    );
    syncQuery(nextA?.player_id ?? null, nextB?.player_id ?? null);
  }

  async function handleCompare() {
    if (!canCompare || !playerA || !playerB) return;

    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      setResult(
        await comparePlayers({
          player_a_id: playerA.player_id,
          player_b_id: playerB.player_id,
          season_code: seasonCode,
        }),
      );
    } catch (comparisonError) {
      setError(
        comparisonError instanceof ScoutServiceError
          ? comparisonError.message
          : "The comparison could not be completed.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Stack spacing={3}>
      <Box>
        <Stack direction="row" sx={{ alignItems: "center", flexWrap: "wrap", gap: 1 }}>
          <Typography component="h1" variant="h1">AI Scout</Typography>
          <Chip label={formatSeasonCode(seasonCode)} size="small" variant="outlined" />
        </Stack>
        <Typography color="text.secondary" sx={{ mt: 0.75 }}>
          Compare two EuroLeague players and generate a concise, data-grounded scouting analysis.
        </Typography>
      </Box>

      <Paper sx={{ p: { xs: 2, sm: 2.5 } }}>
        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
          }}
        >
          <PlayerSelector
            excludedPlayerId={playerB?.player_id ?? null}
            label="Player A"
            onChange={(player) => updateSelection("playerA", player)}
            players={players}
            value={playerA}
          />
          <PlayerSelector
            excludedPlayerId={playerA?.player_id ?? null}
            label="Player B"
            onChange={(player) => updateSelection("playerB", player)}
            players={players}
            value={playerB}
          />
        </Box>
        <Button
          color="secondary"
          disabled={!canCompare || isLoading}
          onClick={handleCompare}
          startIcon={<AutoAwesomeOutlinedIcon />}
          sx={{ mt: 2, minWidth: 180 }}
          variant="contained"
        >
          Compare players
        </Button>
      </Paper>

      {error ? <Alert severity="error" variant="outlined">{error}</Alert> : null}
      {isLoading ? <ScoutLoadingState /> : null}
      {result ? <ScoutResults result={result} /> : null}
    </Stack>
  );
}

function ScoutResults({ result }: { result: ScoutComparisonResponse }) {
  const playerAName = `${result.player_a.first_name} ${result.player_a.last_name}`;
  const playerBName = `${result.player_b.first_name} ${result.player_b.last_name}`;
  return (
    <Stack spacing={3}>
      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" } }}>
        <PlayerComparisonCard label="Player A" player={result.player_a} />
        <PlayerComparisonCard label="Player B" player={result.player_b} />
      </Box>
      <ComparisonChart playerA={result.player_a} playerB={result.player_b} />
      <ComparisonMetrics differences={result.differences} playerA={result.player_a} playerB={result.player_b} />
      <ScoutAnalysis analysis={result.analysis} playerAName={playerAName} playerBName={playerBName} />
    </Stack>
  );
}

function findPlayer(players: PlayerLeaderboardEntry[], playerId: number | null) {
  return playerId === null ? null : players.find((player) => player.player_id === playerId) ?? null;
}

function getMissingPlayerError(
  playerAId: number | null,
  playerBId: number | null,
  playerA: PlayerLeaderboardEntry | null,
  playerB: PlayerLeaderboardEntry | null,
) {
  return (playerAId !== null && !playerA) || (playerBId !== null && !playerB)
    ? "A preselected player is unavailable for this season."
    : null;
}

function syncQuery(playerAId: number | null, playerBId: number | null) {
  const url = new URL(window.location.href);
  if (playerAId === null) url.searchParams.delete("playerA");
  else url.searchParams.set("playerA", playerAId.toString());
  if (playerBId === null) url.searchParams.delete("playerB");
  else url.searchParams.set("playerB", playerBId.toString());
  window.history.replaceState(null, "", `${url.pathname}${url.search}`);
}
