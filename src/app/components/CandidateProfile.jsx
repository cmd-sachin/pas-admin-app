"use client";

import React from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  Avatar,
  LinearProgress,
  Chip,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AssessmentIcon from "@mui/icons-material/Assessment";
import PsychologyIcon from "@mui/icons-material/Psychology";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import SummarizeIcon from "@mui/icons-material/Summarize";
import "../../app/globals.css";

const toTitleCase = (str) => {
  if (!str) return "";
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const renderScore = (label, value) => (
  <Box sx={{ mb: 2 }}>
    <Typography variant="subtitle2" color="text.secondary">
      {toTitleCase(label)}
    </Typography>
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <LinearProgress
        variant="determinate"
        value={value * 20}
        sx={{ flexGrow: 1, mr: 2, height: 10, borderRadius: 5 }}
      />
      <Typography variant="body2">{value}</Typography>
    </Box>
  </Box>
);

const renderValue = (value) => {
  if (value === null || value === undefined) return "";
  if (typeof value === "string" || typeof value === "number") {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map((v, index) => (
      <React.Fragment key={index}>
        {renderValue(v)}
        {index < value.length - 1 ? ", " : ""}
      </React.Fragment>
    ));
  }
  if (typeof value === "object") {
    return (
      <span>
        {Object.keys(value).map((key) => (
          <span key={key}>
            <strong>{toTitleCase(key)}</strong>: {renderValue(value[key])}
            <br />
          </span>
        ))}
      </span>
    );
  }
  return "";
};

const renderField = (label, value) => {
  if (Array.isArray(value)) {
    return (
      <Box sx={{ ml: 2, mb: 1 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
          {toTitleCase(label)}:
        </Typography>
        <Box sx={{ ml: 2 }}>
          {value.map((item, i) => (
            <Typography key={i} variant="body2">
              • {item}
            </Typography>
          ))}
        </Box>
      </Box>
    );
  } else if (typeof value === "object" && value !== null) {
    return (
      <Box sx={{ ml: 2, mb: 1 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
          {toTitleCase(label)}:
        </Typography>
        <Box sx={{ ml: 2 }}>
          {Object.keys(value).map((subKey, idx) => (
            <Box key={idx} sx={{ mb: 0.5 }}>
              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                {toTitleCase(subKey)}:
              </Typography>
              <Typography variant="body2" sx={{ ml: 2 }}>
                {renderValue(value[subKey])}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    );
  } else {
    return (
      <Box sx={{ ml: 2, mb: 1 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
          {toTitleCase(label)}:
        </Typography>
        <Typography variant="body2" sx={{ ml: 2 }}>
          {value}
        </Typography>
      </Box>
    );
  }
};

const RenderAnalysis = ({ analysis }) => {
  if (!analysis) return <Typography variant="body2">N/A</Typography>;

  if (typeof analysis === "string") {
    try {
      analysis = JSON.parse(analysis);
    } catch (error) {
      return <Typography variant="body2">{analysis}</Typography>;
    }
  }

  return (
    <Box>
      {Object.keys(analysis).map((category) => (
        <Box key={category} sx={{ mb: 3 }}>
          <Typography
            variant="h6"
            sx={{
              textTransform: "capitalize",
              mb: 1,
              borderBottom: "1px solid #ccc",
              textAlign: "center",
              pt: 1,
            }}
          >
            {toTitleCase(category)}
          </Typography>
          {Array.isArray(analysis[category]) ? (
            analysis[category].map((entry, idx) => (
              <Box
                key={idx}
                sx={{ mb: 2, pl: 2, borderLeft: "2px solid #ddd", py: 1 }}
              >
                <Typography variant="subtitle1">
                  Question {renderValue(entry.questionNumber)}
                </Typography>
                <Typography variant="body2">
                  <strong>Key Competencies:</strong>{" "}
                  {Array.isArray(entry.keyCompetencies)
                    ? entry.keyCompetencies.join(", ")
                    : renderValue(entry.keyCompetencies)}
                </Typography>
                {entry.improvementAreas &&
                  entry.improvementAreas.length > 0 && (
                    <Box sx={{ mt: 1, ml: 2 }}>
                      <Typography
                        variant="body2"
                        color="error"
                        sx={{ fontWeight: "bold" }}
                      >
                        Improvement Areas:
                      </Typography>
                      {entry.improvementAreas.map((item, i) => (
                        <Box key={i} sx={{ ml: 2, my: 0.5 }}>
                          <Typography variant="body2">
                            • {item.point}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Example: {item.example}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  )}
                {entry.quickRecommendations &&
                  entry.quickRecommendations.length > 0 && (
                    <Box sx={{ mt: 1, ml: 2 }}>
                      <Typography
                        variant="body2"
                        color="primary"
                        sx={{ fontWeight: "bold" }}
                      >
                        Quick Recommendations:
                      </Typography>
                      {entry.quickRecommendations.map((item, i) => (
                        <Box key={i} sx={{ ml: 2, my: 0.5 }}>
                          <Typography variant="body2">
                            • {item.recommendation}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Example: {item.example}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  )}
              </Box>
            ))
          ) : (
            <Box sx={{ ml: 2 }}>
              {Object.keys(analysis[category]).map((field, index) => (
                <Box key={index} sx={{ mb: 1 }}>
                  {renderField(field, analysis[category][field])}
                </Box>
              ))}
            </Box>
          )}
        </Box>
      ))}
    </Box>
  );
};

export default function CandidateProfile({ candidate, onBack }) {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "success";
      case "ongoing":
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", p: 3 }}>
      <Box sx={{ mb: 2 }}>
        <Button variant="outlined" onClick={onBack}>
          Back
        </Button>
      </Box>
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardHeader
          title="Personal Details"
          avatar={
            <Avatar>
              <PersonIcon />
            </Avatar>
          }
          action={
            <Chip
              label={toTitleCase(candidate.status)}
              color={getStatusColor(candidate.status)}
              sx={{ mt: 1 }}
            />
          }
        />
        <CardContent>
          <Typography variant="body1">
            <strong>Name:</strong> {toTitleCase(candidate.name)}
          </Typography>
          <Typography variant="body1">
            <strong>Phone:</strong> {candidate.phoneNumber}
          </Typography>
          <Typography variant="body1">
            <strong>Department:</strong>{" "}
            {toTitleCase(candidate.department?.trim())}
          </Typography>
          <Typography variant="body1">
            <strong>College:</strong> {toTitleCase(candidate.college)}
          </Typography>
        </CardContent>
      </Card>
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
          <Typography sx={{ mt: 2 }}>
            Deduction Points : {candidate.deductionPoints}
          </Typography>
          <Typography
            variant="h6"
            sx={{ mt: 2, textAlign: "center", fontWeight: "800" }}
          >
            Overall Score: {candidate.overallScore}
          </Typography>
        </CardContent>
      </Card>
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardHeader
          title="Recommendation"
          avatar={
            <Avatar>
              <ThumbUpIcon />
            </Avatar>
          }
        />
        <CardContent>
          <Typography
            variant="body1"
            sx={{ textAlign: "center", fontWeight: "800" }}
          >
            {toTitleCase(candidate.recommendation)}
          </Typography>
        </CardContent>
      </Card>
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardHeader
          title="Summary"
          avatar={
            <Avatar>
              <SummarizeIcon />
            </Avatar>
          }
        />
        <CardContent>
          <Typography
            variant="body1"
            sx={{ textAlign: "center", fontWeight: "500" }}
          >
            {toTitleCase(candidate.summary)}
          </Typography>
        </CardContent>
      </Card>

      <Box sx={{ display: "flex", gap: 3, mb: 3 }}>
        <Card variant="outlined" sx={{ flex: 1 }}>
          <CardHeader
            title="Detailed Analysis"
            avatar={
              <Avatar>
                <AssessmentIcon />
              </Avatar>
            }
          />
          <CardContent sx={{ maxHeight: 600, overflowY: "auto" }}>
            <RenderAnalysis analysis={candidate.detailedAnalysis} />
          </CardContent>
        </Card>
        <Card variant="outlined" sx={{ flex: 1 }}>
          <CardHeader
            title="Behavioral Analysis"
            avatar={
              <Avatar>
                <PsychologyIcon />
              </Avatar>
            }
          />
          <CardContent sx={{ maxHeight: 600, overflowY: "auto" }}>
            <RenderAnalysis analysis={candidate.behavioralAnalysis} />
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
