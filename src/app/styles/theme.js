import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#2196f3", // Blue 500
      light: "#64b5f6", // Blue 300
      dark: "#1976d2", // Blue 700
    },
    secondary: {
      main: "#607d8b", // Slate 500
      light: "#90a4ae", // Slate 300
      dark: "#455a64", // Slate 700
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          transition: "transform 0.3s, box-shadow 0.3s",
          "&:hover": {
            transform: "translateY(-3px)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: "bold",
          borderRadius: 6,
          padding: "6px 16px",
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          marginBottom: "16px",
        },
      },
    },
  },
});
