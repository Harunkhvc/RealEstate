// src/app/PrivateAdminRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../shared/context/AuthContext";

export default function PrivateAdminRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/" replace />;

  return <>{children}</>;
}
