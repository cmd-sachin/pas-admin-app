"use client";

import { useState, useEffect } from "react";
import Layout from "../app/components/Layout";
import CandidatesList from "../app/components/CandidateList";
import Leaderboard from "../app/components/Leaderboard";
import CandidateProfile from "../app/components/CandidateProfile";
import { Tabs, Tab, Box } from "@mui/material";
import "../app/globals.css";

export default function AdminDashboard() {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [error, setError] = useState(null);
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

  const handleSelectCandidate = (candidate) => {
    try {
      setSelectedCandidate({
        ...candidate,
        detailedAnalysis: JSON.parse(candidate.detailedAnalysis),
        behavioralAnalysis: JSON.parse(candidate.behavioralAnalysis),
      });
    } catch (error) {
      console.error("Error parsing analysis data:", error);
      setSelectedCandidate(candidate); // Fallback to raw data if needed
    }
  };

  return (
    <Layout>
      <Box sx={{ width: "100%" }}>
        <Tabs
          value={selectedTab}
          onChange={(e, val) => setSelectedTab(val)}
          centered
        >
          <Tab label="Candidates" />
          <Tab label="Leaderboard" />
        </Tabs>
        {selectedTab === 0 &&
          (selectedCandidate ? (
            <CandidateProfile
              candidate={selectedCandidate}
              onBack={() => setSelectedCandidate(null)}
            />
          ) : (
            <CandidatesList
              candidates={candidates}
              loading={loading}
              error={error}
              onSelectCandidate={handleSelectCandidate}
            />
          ))}
        {selectedTab === 1 && (
          <Leaderboard
            candidates={candidates}
            loading={loading}
            error={error}
          />
        )}
      </Box>
    </Layout>
  );
}
