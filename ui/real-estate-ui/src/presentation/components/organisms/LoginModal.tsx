import React, { useState, useEffect } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Tabs, Tab, Box, Divider, IconButton, InputAdornment
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function LoginModal({ open, onClose }: Props) {
  const [tab, setTab] = useState(0);

  // Login state
  const [login, setLogin] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState({ email: "", password: "" });
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register state
  const [register, setRegister] = useState({ name: "", email: "", password: "" });
  const [registerError, setRegisterError] = useState({ name: "", email: "", password: "" });
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);

  // Reset fields when modal is closed
  useEffect(() => {
    if (!open) {
      setLogin({ email: "", password: "" });
      setLoginError({ email: "", password: "" });
      setRegister({ name: "", email: "", password: "" });
      setRegisterError({ name: "", email: "", password: "" });
      setTab(0);
      setShowLoginPassword(false);
      setShowRegisterPassword(false);
    }
  }, [open]);

  // Simple validation
  const validateEmail = (email: string) =>
    /\S+@\S+\.\S+/.test(email) ? "" : "Geçerli bir e-posta giriniz";
  const validatePassword = (password: string) =>
    password.length >= 6 ? "" : "Şifre en az 6 karakter olmalı";
  const validateName = (name: string) =>
    name.trim().length > 0 ? "" : "Ad Soyad zorunlu";

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const emailError = validateEmail(login.email);
    const passwordError = validatePassword(login.password);
    setLoginError({ email: emailError, password: passwordError });

    if (!emailError && !passwordError) {
      alert(`Giriş Başarılı! (${login.email})`);
      onClose();
    }
  };

  const handleRegister = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const nameError = validateName(register.name);
    const emailError = validateEmail(register.email);
    const passwordError = validatePassword(register.password);
    setRegisterError({ name: nameError, email: emailError, password: passwordError });

    if (!nameError && !emailError && !passwordError) {
      alert(`Kayıt Başarılı! (${register.email})`);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ p: 0 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} centered>
          <Tab label="Giriş Yap" />
          <Tab label="Kayıt Ol" />
        </Tabs>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 10,
            top: 10,
            color: "grey.500",
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {tab === 0 ? (
          <Box
            component="form"
            sx={{ mt: 1 }}
            onSubmit={handleLogin}
            autoComplete="off"
          >
            <TextField
              label="E-Posta"
              type="email"
              autoComplete="username"
              fullWidth
              margin="normal"
              value={login.email}
              onChange={e => setLogin(l => ({ ...l, email: e.target.value }))}
              error={!!loginError.email}
              helperText={loginError.email}
              required
            />
            <TextField
              label="Şifre"
              type={showLoginPassword ? "text" : "password"}
              autoComplete="current-password"
              fullWidth
              margin="normal"
              value={login.password}
              onChange={e => setLogin(l => ({ ...l, password: e.target.value }))}
              error={!!loginError.password}
              helperText={loginError.password}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowLoginPassword(v => !v)}
                      edge="end"
                      tabIndex={-1}
                    >
                      {showLoginPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <input type="submit" hidden /> {/* Enter ile submit */}
          </Box>
        ) : (
          <Box
            component="form"
            sx={{ mt: 1 }}
            onSubmit={handleRegister}
            autoComplete="off"
          >
            <TextField
              label="Ad Soyad"
              fullWidth
              margin="normal"
              value={register.name}
              onChange={e => setRegister(r => ({ ...r, name: e.target.value }))}
              error={!!registerError.name}
              helperText={registerError.name}
              required
            />
            <TextField
              label="E-Posta"
              type="email"
              autoComplete="username"
              fullWidth
              margin="normal"
              value={register.email}
              onChange={e => setRegister(r => ({ ...r, email: e.target.value }))}
              error={!!registerError.email}
              helperText={registerError.email}
              required
            />
            <TextField
              label="Şifre"
              type={showRegisterPassword ? "text" : "password"}
              autoComplete="new-password"
              fullWidth
              margin="normal"
              value={register.password}
              onChange={e => setRegister(r => ({ ...r, password: e.target.value }))}
              error={!!registerError.password}
              helperText={registerError.password}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowRegisterPassword(v => !v)}
                      edge="end"
                      tabIndex={-1}
                    >
                      {showRegisterPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <input type="submit" hidden /> {/* Enter ile submit */}
          </Box>
        )}
        <Divider sx={{ my: 2 }}>veya</Divider>
        <Button
          fullWidth
          variant="outlined"
          sx={{ mb: 1 }}
          onClick={() => alert("Google ile giriş yakında!")}
        >
          Google ile Giriş Yap
        </Button>
        <Button
          fullWidth
          variant="outlined"
          onClick={() => alert("Facebook ile giriş yakında!")}
        >
          Facebook ile Giriş Yap
        </Button>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        {tab === 0 ? (
          <Button
            variant="contained"
            fullWidth
            onClick={handleLogin}
            type="submit"
            sx={{ fontWeight: 700, fontSize: 17 }}
          >
            Giriş Yap
          </Button>
        ) : (
          <Button
            variant="contained"
            fullWidth
            onClick={handleRegister}
            type="submit"
            sx={{ fontWeight: 700, fontSize: 17 }}
          >
            Kayıt Ol
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
