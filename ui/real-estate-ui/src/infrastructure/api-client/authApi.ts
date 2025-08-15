// src/infrastructure/api-client/authApi.ts
import axiosInstance from "../http/axiosInstance";
import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from "../../shared/types/authTypes";

export const login = async (data: LoginRequest) => {
  const { data: res } = await axiosInstance.post<LoginResponse>("/auth/login", data);
  return res;
};

export const register = async (data: RegisterRequest) => {
  const { data: res } = await axiosInstance.post<RegisterResponse>("/auth/register", data);
  return res;
};
