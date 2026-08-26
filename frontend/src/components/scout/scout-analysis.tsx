import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type { ScoutAnalysis as ScoutAnalysisData } from "@/types/scout";

type ScoutAnalysisProps = {
  analysis: ScoutAnalysisData;
  playerAName: string;
  playerBName: string;
};

export function ScoutAnalysis({
  analysis,
  playerAName,
  playerBName,
}: ScoutAnalysisProps) {
  return (
    <Paper
      component="section"
      sx={{
        bgcolor: "ai.light",
        borderColor: "ai.main",
        color: "ai.contrastText",
        p: { xs: 2.5, sm: 3 },
      }}
      variant="outlined"
    >
      <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 1.5 }}>
        <AutoAwesomeOutlinedIcon sx={{ color: "ai.contrastText" }} />
        <Typography variant="h2">AI scouting analysis</Typography>
      </Stack>
      <Typography>{analysis.summary}</Typography>

      <Box
        sx={{
          display: "grid",
          gap: 2.5,
          gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
          my: 2.5,
        }}
      >
        <AnalysisList items={analysis.player_a_strengths} title={`${playerAName} strengths`} />
        <AnalysisList items={analysis.player_b_strengths} title={`${playerBName} strengths`} />
      </Box>

      <Divider sx={{ borderColor: "ai.dark", my: 2.5, opacity: 0.35 }} />
      <AnalysisList items={analysis.key_differences} title="Key differences" />
      <Typography sx={{ mt: 2.5 }} variant="h3">
        Conclusion
      </Typography>
      <Typography sx={{ mt: 0.75 }}>{analysis.conclusion}</Typography>

      {analysis.data_limitations.length > 0 ? (
        <Box sx={{ mt: 2.5 }}>
          <AnalysisList items={analysis.data_limitations} title="Data limitations" />
        </Box>
      ) : null}
    </Paper>
  );
}

function AnalysisList({ items, title }: { items: string[]; title: string }) {
  return (
    <Box>
      <Typography variant="h3">{title}</Typography>
      <Box component="ul" sx={{ mb: 0, mt: 1, pl: 2.5 }}>
        {items.map((item) => (
          <Typography component="li" key={item} sx={{ mb: 0.5 }} variant="body2">
            {item}
          </Typography>
        ))}
      </Box>
    </Box>
  );
}
