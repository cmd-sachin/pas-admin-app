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
  // 0 = Dashboard, 1 = Leaderboard
  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/airTable");

        // Check for a 500 error or any non-OK status
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Failed to fetch candidates. Server responded with: ${errorText}`
          );
        }

        const data = await response.json();

        // Check if the table is empty
        if (!data.data || data.data.length === 0) {
          throw new Error("Candidates table is empty");
        }

        setCandidates(data.data);
        setError(null); // Clear any previous error
      } catch (err) {
        setError(err.message);
        setCandidates([]); // Clear candidates in case of error
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
        detailedAnalysis: JSON.parse(candidate?.detailedAnalysis),
        behavioralAnalysis: JSON.parse(candidate?.behavioralAnalysis),
      });
    } catch (error) {
      console.error("Error parsing analysis data:", error);
      setSelectedCandidate(candidate);
    }
  };

  return (
    <Layout>
      <Box sx={{ width: "100%" }}>
        {/* Tabs for Navigation */}
        <Tabs
          value={selectedTab}
          onChange={(e, val) => setSelectedTab(val)}
          centered
        >
          <Tab label="Dashboard" />
          <Tab label="Leaderboard" />
        </Tabs>

        {/* Conditional Rendering of Main Content */}
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
