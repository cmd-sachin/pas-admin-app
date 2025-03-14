"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import "../../app/globals.css";

export default function Leaderboard({ candidates, loading, error }) {
  // Sort candidates by overallScore (descending)
  const sortedCandidates = [...candidates].sort(
    (a, b) => b.overallScore - a.overallScore
  );

  const toTitleCase = (str) => {
    if (!str) return "";
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  return (
    <Card sx={{ mt: 3 }}>
      <CardHeader title={<Typography variant="h5">Leaderboard</Typography>} />
      <Typography
        variant="subtitle1"
        color="text.secondary"
        sx={{ mx: 1, mt: 2, fontWeight: 550, color: "var(--primary-color)" }}
      >
        Candidates Found: {sortedCandidates.length}
      </Typography>
      <CardContent>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", pb: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : (
          <Box>
            {sortedCandidates.map((candidate, index) => {
              const emoji =
                index === 0
                  ? "🥇"
                  : index === 1
                  ? "🥈"
                  : index === 2
                  ? "🥉"
                  : "";
              return (
                <Card
                  key={index}
                  variant="outlined"
                  sx={{ mb: 2, "&:hover": { bgcolor: "action.hover" } }}
                >
                  <CardContent
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box>
                      <Typography variant="h6">
                        {index + 1}. {emoji} {toTitleCase(candidate.name)}
                      </Typography>
                      {candidate.email && (
                        <Typography variant="body2" color="text.secondary">
                          {candidate.email}
                        </Typography>
                      )}
                    </Box>
                    <Typography variant="h6">
                      Score: {candidate.overallScore || "On Going"}
                    </Typography>
                  </CardContent>
                </Card>
              );
            })}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
