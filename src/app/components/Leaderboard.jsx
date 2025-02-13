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
  const sortedCandidates = [...candidates].sort(
    (a, b) => b.overallscore - a.overallscore
  );

  return (
    <Card sx={{ mt: 3 }}>
      <CardHeader title={<Typography variant="h5">Leaderboard</Typography>} />
      <CardContent>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : (
          <Box>
            {sortedCandidates.map((candidate, index) => (
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
                      {index + 1}. {candidate.name}
                    </Typography>
                    {candidate.email && (
                      <Typography variant="body2" color="text.secondary">
                        {candidate.email}
                      </Typography>
                    )}
                  </Box>
                  <Typography variant="h6">
                    Score: {candidate.overallScore}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
