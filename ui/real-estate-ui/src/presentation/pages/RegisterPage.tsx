import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Paper,
  Link,
} from "@mui/material";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { register } from "../../infrastructure/api-client/authApi";

// Harun Emlak için özel görsel — değiştirebilirsin
const IMAGE_URL =
  "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=600&q=80";
const LOGO_URL =
  "https://cdn-icons-png.flaticon.com/512/69/69524.png"; // Emlak/ev simgeli bir logo

export default function RegisterPage() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setSubmitting(true);
    try {
      await register(form); // API çağrısı
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1200);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin."
      );
    } finally {
      setSubmitting(false);
    }
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
        elevation={8}
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          borderRadius: 4,
          overflow: "hidden",
          width: { xs: "100%", sm: 420, md: 880 },
          maxWidth: "98vw",
          boxShadow: "0 12px 36px 0 #10152d33",
          p: 0,
        }}
      >
        {/* Sol: Görsel, Logo ve Tanıtım */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            flex: 1,
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "#f5f5f5",
            minHeight: 430,
            borderRight: "1px solid #eee",
            p: 0,
            position: "relative",
          }}
        >
          <img
            src={IMAGE_URL}
            alt="Kayıt Banner"
            style={{
              width: "100%",
              height: 330,
              objectFit: "cover",
              filter: "brightness(0.94) saturate(1.2)",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              top: 32,
              left: 0,
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <img
              src={LOGO_URL}
              alt="Harun Emlak Logo"
              style={{
                width: 64,
                height: 64,
                borderRadius: 12,
                boxShadow: "0 4px 16px #10152d28",
                background: "#fff",
                padding: 7,
              }}
            />
            <Typography
              variant="h4"
              fontWeight={900}
              color="#e53935"
              align="center"
              letterSpacing={1}
              mt={1}
              sx={{
                textShadow: "0 2px 6px #fff8",
                bgcolor: "#fff9",
                px: 2.5,
                borderRadius: 2,
                py: 0.2,
              }}
            >
              Harun Emlak
            </Typography>
            <Typography
              variant="subtitle1"
              color="#333"
              align="center"
              mt={1}
              sx={{
                px: 2,
                bgcolor: "#fff9",
                borderRadius: 1,
                fontWeight: 500,
              }}
            >
              Yeni nesil gayrimenkul platformunda yerinizi alın!
            </Typography>
          </Box>
        </Box>

        {/* Sağ: Form */}
        <Box
          sx={{
            flex: 1,
            p: { xs: 3, sm: 5 },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: 340,
          }}
        >
          <Box sx={{ width: "100%", maxWidth: 350 }}>
            <Typography
              variant="h5"
              align="center"
              fontWeight={800}
              mb={2}
              color="#d32f2f"
              letterSpacing={1}
            >
              {"Kayıt Ol"}
            </Typography>
            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {t("registerSuccess") ||
                  "Kaydınız başarıyla oluşturuldu. Yönlendiriliyorsunuz..."}
              </Alert>
            )}
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <form onSubmit={handleSubmit}>
              <TextField
                label={"Kullanıcı Adı"}
                fullWidth
                value={form.username}
                onChange={e =>
                  setForm(f => ({ ...f, username: e.target.value }))
                }
                margin="normal"
                autoComplete="username"
                sx={{ background: "#fff", borderRadius: 2 }}
                required
                disabled={submitting}
              />
              <TextField
                label={"Şifre"}
                fullWidth
                type="password"
                value={form.password}
                onChange={e =>
                  setForm(f => ({ ...f, password: e.target.value }))
                }
                margin="normal"
                autoComplete="new-password"
                sx={{ background: "#fff", borderRadius: 2 }}
                required
                disabled={submitting}
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
                  "&:hover": { bgcolor: "#b71c1c" },
                }}
                disabled={submitting}
              >
                {"Kayıt Ol"}
              </Button>
            </form>
            <Box mt={2}>
              <Typography
                variant="body2"
                color="text.secondary"
                align="center"
              >
                {"Zaten hesabın var mı?"}{" "}
                <Link
                  component={RouterLink}
                  to="/login"
                  underline="hover"
                  sx={{ color: "#e53935", fontWeight: 700 }}
                >
                  {"Giriş Yap"}
                </Link>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
