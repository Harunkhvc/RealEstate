// src/presentation/pages/LoginPage.tsx

import React, { useState, useEffect } from "react";
import {
  Box, Button, TextField, Typography, Alert, Paper, Link, InputAdornment, IconButton
} from "@mui/material";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../shared/context/AuthContext";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

// Sabit şirket/görsel URL'si
const IMAGE_URL = "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80";

export default function LoginPage() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { login, error, user } = useAuth();

  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await login(form.username, form.password);
    setSubmitting(false);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#fafbfc",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      <Paper
        elevation={10}
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          borderRadius: 4,
          overflow: "hidden",
          width: { xs: "100%", sm: 430, md: 880 },
          maxWidth: "98vw",
          boxShadow: "0 12px 36px 0 #10152d33",
        }}
      >
        {/* Görsel & Tanıtım */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "#f7f4f4ff",
            minHeight: 420,
            p: 4,
            flexDirection: "column",
            borderRight: "1px solid #eee",
          }}
        >
          <img
            src={IMAGE_URL}
            alt="Login Banner"
            style={{
              width: "85%",
              maxWidth: 330,
              borderRadius: 16,
              marginBottom: 32,
              objectFit: "cover",
              boxShadow: "0 4px 24px 0 #1111",
            }}
          />
          <Typography
            variant="h4"
            fontWeight={900}
            color="#e53935"
            gutterBottom
            align="center"
          >
            Harun Emlak
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            align="center"
          >
            Modern, hızlı ve güvenli bir emlak platformuna hoş geldiniz.
          </Typography>
        </Box>
        {/* Login Form */}
        <Box
          sx={{
            flex: 1,
            p: { xs: 3, sm: 5 },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box sx={{ width: "100%", maxWidth: 360 }}>
            <Typography
              variant="h5"
              align="center"
              fontWeight={800}
              mb={3}
              color="#d32f2f"
              letterSpacing={1}
            >
              { "Giriş Yap"}
            </Typography>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <form onSubmit={handleSubmit}>
              <TextField
                label={ "Kullanıcı Adı"}
                fullWidth
                value={form.username}
                onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                margin="normal"
                autoComplete="username"
                sx={{ background: "#fff", borderRadius: 2 }}
                required
              />
              <TextField
                label={ "Şifre"}
                fullWidth
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                margin="normal"
                autoComplete="current-password"
                sx={{ background: "#fff", borderRadius: 2 }}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((v) => !v)}
                        edge="end"
                        tabIndex={-1}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  mt: 2,
                  fontWeight: 700,
                  borderRadius: 2,
                  fontSize: 17,
                  bgcolor: "#e53935",
                  py: 1.2,
                  letterSpacing: 1,
                  "&:hover": { bgcolor: "#b71c1c" }
                }}
                disabled={submitting}
              >
                {submitting ? t("loggingIn") || "..." : t("login") || "Giriş Yap"}
              </Button>
            </form>
            <Box mt={2}>
              <Typography variant="body2" color="text.secondary" align="center">
                { "Hesabın yok mu?"}{" "}
                <Link
                  component={RouterLink}
                  to="/register"
                  underline="hover"
                  sx={{ color: "#e53935", fontWeight: 700 }}
                >
                  { "Üye Ol"}
                </Link>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
