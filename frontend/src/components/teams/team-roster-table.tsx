import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";

import { LeaderboardAvatar } from "@/components/players/leaderboard-avatar";
import type { TeamRosterPlayer } from "@/types/team";

export function TeamRosterTable({ roster }: { roster: TeamRosterPlayer[] }) {
  return (
    <Box component="section">
      <Typography sx={{ mb: 1.5 }} variant="h2">
        Roster
      </Typography>
      {roster.length === 0 ? (
        <Paper sx={{ p: 3 }}>
          <Typography color="text.secondary">No roster data is available for this season.</Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
          <Table size="small" sx={{ minWidth: 900 }}>
            <TableHead>
              <TableRow>
                <TableCell>Player</TableCell>
                {['GP', 'MPG', 'PPG', 'RPG', 'APG', 'SPG', 'BPG', '3P%', 'PIR'].map((label) => (
                  <TableCell align="right" key={label}>{label}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {roster.map((player) => (
                <TableRow hover key={player.player_id}>
                  <TableCell>
                    <Stack direction="row" spacing={1.25} sx={{ alignItems: "center" }}>
                      <LeaderboardAvatar
                        alt=""
                        fallback={`${player.first_name.charAt(0)}${player.last_name.charAt(0)}`}
                        size={36}
                        src={player.image_url}
                      />
                      <Link href={`/players/${player.player_id}`} sx={{ color: "text.primary", fontWeight: 650, whiteSpace: "nowrap" }} underline="hover">
                        {player.first_name} {player.last_name}
                      </Link>
                    </Stack>
                  </TableCell>
                  <NumberCell value={player.games_played} />
                  <NumberCell value={player.minutes_per_game} />
                  <NumberCell value={player.points_per_game} />
                  <NumberCell value={player.rebounds_per_game} />
                  <NumberCell value={player.assists_per_game} />
                  <NumberCell value={player.steals_per_game} />
                  <NumberCell value={player.blocks_per_game} />
                  <NumberCell percentage value={player.three_point_percentage} />
                  <NumberCell emphasized value={player.pir_per_game} />
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}

function NumberCell({ emphasized = false, percentage = false, value }: { emphasized?: boolean; percentage?: boolean; value: number }) {
  const formatted = Number.isInteger(value) && !percentage ? value.toString() : value.toFixed(1);
  return (
    <TableCell align="right" sx={{ color: emphasized ? "primary.main" : "text.primary", fontWeight: emphasized ? 750 : 500 }}>
      {formatted}{percentage ? "%" : ""}
    </TableCell>
  );
}
