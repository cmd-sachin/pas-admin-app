"use client";
import React, { useState, useEffect } from "react";
import "../app/globals.css";
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Button,
  TextField,
  IconButton,
  Grid,
  CircularProgress,
  Box,
  Alert,
  Tabs,
  Tab,
  Chip,
  LinearProgress,
  Avatar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import MessageIcon from "@mui/icons-material/Message";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import PsychologyIcon from "@mui/icons-material/Psychology";
import AssessmentIcon from "@mui/icons-material/Assessment";
import PersonIcon from "@mui/icons-material/Person";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import SummarizeIcon from "@mui/icons-material/Summarize";
import { AlignCenter } from "lucide-react";
const ITEMS_PER_PAGE = 5;
/**
 * CandidateProfile renders a detailed view for a candidate.
 * It shows Personal Details, Scores, Analysis (Detailed & Behavioral),
 * Recommendation, and Summary.
 */
function CandidateProfile({ candidate, onBack }) {
  // Helper: Render a score with a progress bar (assuming a 5-point scale).
  const renderScore = (label, value) => (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle2" color="text.secondary">
        {label}
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <LinearProgress
          variant="determinate"
          value={value * 20}
          sx={{ flexGrow: 1, mr: 2 }}
        />
        <Typography variant="body2">{value}</Typography>
      </Box>
    </Box>
  );
  // Helper: Format analysis content.
  const formatAnalysis = (analysis) => {
    if (!analysis) return "N/A";
    if (typeof analysis === "string") return analysis;
    return JSON.stringify(analysis, null, 2);
  };
  return (
    <Box sx={{ maxWidth: 900, mx: "auto", p: 3 }}>
      {/* Back Button */}
      <Box sx={{ mb: 2 }}>
        <Button variant="outlined" onClick={onBack}>
          Back
        </Button>
      </Box>
      {/* Personal Details */}
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardHeader
          title="Personal Details"
          avatar={
            <Avatar>
              <PersonIcon />
            </Avatar>
          }
        />
        <CardContent>
          <Typography variant="body1">
            <strong>Name:</strong> {candidate.Name}
          </Typography>
          <Typography variant="body1">
            <strong>Phone:</strong> {candidate.phone_number}
          </Typography>
          <Typography variant="body1">
            <strong>Department:</strong>{" "}
            {candidate.Department && candidate.Department.trim()}
          </Typography>
          <Typography variant="body1">
            <strong>College:</strong> {candidate.College}
          </Typography>
        </CardContent>
      </Card>
      {/* Score Card */}
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardHeader
          title="Scores"
          avatar={
            <Avatar>
              <TrendingUpIcon />
            </Avatar>
          }
        />
        <CardContent>
          {renderScore("Communication Score", candidate.communicationScore)}
          {renderScore("Innovation Score", candidate.innovationScore)}
          {renderScore("Fire in Belly Score", candidate.fireInBellyScore)}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Deduction Points
            </Typography>
            <Typography variant="body1">{candidate.deductionPoints}</Typography>
          </Box>
          <Typography variant="h6" sx={{ mt: 2 }}>
            Overall Score: {candidate.overallscore}
          </Typography>
        </CardContent>
      </Card>
      {/* Analysis Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardHeader
              title="Detailed Analysis"
              avatar={
                <Avatar>
                  <AssessmentIcon />
                </Avatar>
              }
            />
            <CardContent>
              <Typography component="pre" sx={{ whiteSpace: "pre-wrap" }}>
                {formatAnalysis(candidate.detailedAnalysis)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardHeader
              title="Behavioral Analysis"
              avatar={
                <Avatar>
                  <PsychologyIcon />
                </Avatar>
              }
            />
            <CardContent>
              <Typography component="pre" sx={{ whiteSpace: "pre-wrap" }}>
                {formatAnalysis(candidate.behavioralAnalysis)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      {/* Recommendation */}
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardHeader
          title="Recommendation"
          avatar={
            <Avatar sx={{ bgcolor: "success.main" }}>
              <ThumbUpIcon />
            </Avatar>
          }
        />
        <CardContent>
          <Typography variant="body1">{candidate.recommendation}</Typography>
        </CardContent>
      </Card>
      {/* Summary */}
      <Card variant="outlined">
        <CardHeader
          title="Summary"
          avatar={
            <Avatar sx={{ bgcolor: "error.main" }}>
              <SummarizeIcon />
            </Avatar>
          }
        />
        <CardContent>
          <Typography variant="body1">{candidate.summary}</Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
/**
 * AdminDashboard renders two tabs:
 *  - "Candidates": displays a searchable, paginated list of candidates.
 *    Clicking "View Details" shows the CandidateProfile view.
 *  - "LeaderBoard": displays candidates sorted by overallscore in descending order.
 */
export default function AdminDashboard() {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState(0);
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/airTable");
        if (!response.ok) throw new Error("Failed to fetch candidates");
        const data = await response.json();
        setCandidates(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCandidates();
  }, []);
  const filteredCandidates = candidates.filter((candidate) =>
    candidate.Name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filteredCandidates.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCandidates = filteredCandidates.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    setSelectedCandidate(null);
  };
  // When a candidate is selected, preserve any analysis fields.
  const handleSelectCandidate = (candidate) => {
    setSelectedCandidate({
      ...candidate,
      detailedAnalysis:
        typeof candidate.detailedAnalysis === "string"
          ? candidate.detailedAnalysis
          : candidate.detailedAnalysis,
      behavioralAnalysis:
        typeof candidate.behavioralAnalysis === "string"
          ? candidate.behavioralAnalysis
          : candidate.behavioralAnalysis,
    });
  };
  // Create a sorted leaderboard array (by overallscore descending)
  const leaderboardCandidates = [...candidates].sort(
    (a, b) => b.overallscore - a.overallscore
  );
  return (
    <Box
      sx={{
        maxWidth: 1200,
        mx: "auto",
        p: 3,
      }}
    >
      <CardHeader
        title={<Typography variant="h5">Admin Dashboard</Typography>}
        sx={{ textAlign: "center" }}
      />
      <Tabs value={selectedTab} onChange={(e, val) => setSelectedTab(val)}>
        <Tab label="Candidates" />
        <Tab label="LeaderBoard" />
      </Tabs>
      {selectedTab === 0 && (
        <>
          {selectedCandidate ? (
            <CandidateProfile
              candidate={selectedCandidate}
              onBack={() => setSelectedCandidate(null)}
            />
          ) : (
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
                  <Box
                    sx={{ display: "flex", justifyContent: "center", py: 4 }}
                  >
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
                              {candidate.Name}
                            </Typography>
                            {candidate.Email && (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {candidate.Email}
                              </Typography>
                            )}
                          </Box>
                          <Button
                            variant="outlined"
                            onClick={() => handleSelectCandidate(candidate)}
                          >
                            View Details
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                    {/* Pagination Controls */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mt: 3,
                      }}
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
          )}
        </>
      )}
      {selectedTab === 1 && (
        <Card sx={{ mt: 3 }}>
          <CardHeader
            title={<Typography variant="h5">LeaderBoard</Typography>}
          />
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
                {leaderboardCandidates.map((candidate, index) => (
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
                          {index + 1}. {candidate.Name}
                        </Typography>
                        {candidate.Email && (
                          <Typography variant="body2" color="text.secondary">
                            {candidate.Email}
                          </Typography>
                        )}
                      </Box>
                      <Typography variant="h6">
                        Score: {candidate.overallscore}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
