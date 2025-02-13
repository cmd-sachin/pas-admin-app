"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  TextField,
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert,
  IconButton,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import "../../app/globals.css";

const ITEMS_PER_PAGE = 5;

export default function CandidatesList({
  candidates,
  loading,
  error,
  onSelectCandidate,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCandidates = candidates.filter((candidate) =>
    candidate.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filteredCandidates.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCandidates = filteredCandidates.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  const toTitleCase = (str) => {
    if (!str) return "";
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  return (
    <Card sx={{ mt: 3 }}>
      <CardContent>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search candidates..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          sx={{ mb: 3 }}
        />
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
            {paginatedCandidates.map((candidate, index) => (
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
                      {toTitleCase(candidate.name)}
                    </Typography>
                    {candidate.email && (
                      <Typography variant="body2" color="text.secondary">
                        {candidate.email}
                      </Typography>
                    )}
                  </Box>
                  <Button
                    variant="outlined"
                    onClick={() => onSelectCandidate(candidate)}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}
            >
              <Typography variant="body2" color="text.secondary">
                Page {currentPage} of {totalPages}
              </Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                <IconButton
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeftIcon />
                </IconButton>
                <IconButton
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRightIcon />
                </IconButton>
              </Box>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
