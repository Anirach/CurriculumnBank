import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Google as GoogleIcon } from "@mui/icons-material";
import { useAuth } from "../../contexts/AuthContext";

function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const googleButtonRef = useRef(null);

  // Get the page to redirect to after login
  const from = location.state?.from?.pathname || "/";

  // If already authenticated, redirect
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  // Handle the credential response from Google
  const handleGoogleCredentialResponse = useCallback(
    async (response) => {
      try {
        setLoading(true);
        setError("");

        // Get token from Google Sign-In
        const googleToken = response.credential;

        // Send token to our backend using the login function from auth context
        await login(googleToken);

        // Redirect to the page they were trying to access
        navigate(from, { replace: true });
      } catch (error) {
        console.error("Google Sign-In error:", error);
        setError(error.message || "Failed to sign in with Google");
      } finally {
        setLoading(false);
      }
    },
    [login, navigate, from]
  );

  // Initialize Google Sign-In
  useEffect(() => {
    // Load Google Sign-In API script
    const loadGoogleScript = () => {
      if (window.gapi) return;

      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleSignIn;
      document.body.appendChild(script);
    };

    // Initialize Google Sign-In once script is loaded
    const initializeGoogleSignIn = () => {
      if (!window.google) return;

      window.google.accounts.id.initialize({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        callback: handleGoogleCredentialResponse,
      });

      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: "outline",
        size: "large",
        width: googleButtonRef.current.clientWidth,
      });
    };

    loadGoogleScript();
  }, [handleGoogleCredentialResponse]);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "60vh",
      }}
    >
      <Paper sx={{ p: 4, maxWidth: 400, width: "100%" }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Sign In
        </Typography>

        <Typography variant="body1" align="center" sx={{ mb: 3 }}>
          Sign in to access the CurriculumnBank
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Google Sign-In button will be rendered here */}
        <Box
          ref={googleButtonRef}
          sx={{
            width: "100%",
            height: 50,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* Fallback button if Google script fails to load */}
          {!window.google && !loading && (
            <Button
              variant="contained"
              color="primary"
              fullWidth
              startIcon={<GoogleIcon />}
              disabled={true}
              sx={{ py: 1.5 }}
            >
              Sign in with Google
            </Button>
          )}
          {loading && <CircularProgress size={24} />}
        </Box>

        <Typography
          variant="body2"
          color="textSecondary"
          align="center"
          sx={{ mt: 3 }}
        >
          By signing in, you agree to our terms of service and privacy policy.
        </Typography>

        <Typography
          variant="body2"
          color="textSecondary"
          align="center"
          sx={{ mt: 2, fontStyle: "italic" }}
        >
          Note: This is a demo application. In a real implementation, you would
          be redirected to the actual Google Sign-In page.
        </Typography>
      </Paper>
    </Box>
  );
}

export default Login;
