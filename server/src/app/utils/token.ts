import { CookieOptions, Response } from "express";
import { JwtPayload, SignOptions } from "jsonwebtoken";
import { CookieUtils } from "./cookie";
import { jwtUtils } from "./jwt";
import { envVars } from "../config/env";

const isProd = envVars.NODE_ENV === "production";

// Prod (HTTPS): secure + none | Local (http): lax
const baseCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "none" : "lax",
  path: "/",
};

const ONE_DAY = 60 * 60 * 24 * 1000; // ms
const SEVEN_DAYS = ONE_DAY * 7;

// Creating access token
const getAccessToken = (payload: JwtPayload) => {
  return jwtUtils.createToken(payload, envVars.ACCESS_TOKEN_SECRET, {
    expiresIn: envVars.ACCESS_TOKEN_EXPIRES_IN,
  } as SignOptions);
};

// Creating refresh token
const getRefreshToken = (payload: JwtPayload) => {
  return jwtUtils.createToken(payload, envVars.REFRESH_TOKEN_SECRET, {
    expiresIn: envVars.REFRESH_TOKEN_EXPIRES_IN,
  } as SignOptions);
};

const setAccessTokenCookie = (res: Response, token: string) => {
  CookieUtils.setCookie(res, "accessToken", token, {
    ...baseCookieOptions,
    maxAge: ONE_DAY,
  });
};

const setRefreshTokenCookie = (res: Response, token: string) => {
  CookieUtils.setCookie(res, "refreshToken", token, {
    ...baseCookieOptions,
    maxAge: SEVEN_DAYS,
  });
};

const setBetterAuthSessionCookie = (res: Response, token: string) => {
  CookieUtils.setCookie(res, "better-auth.session_token", token, {
    ...baseCookieOptions,
    maxAge: ONE_DAY,
  });
};


// For logout: The same options used during setup are also required when clearing.
const clearAuthCookies = (res: Response) => {
  CookieUtils.clearCookie(res, "accessToken", baseCookieOptions);
  CookieUtils.clearCookie(res, "refreshToken", baseCookieOptions);
  CookieUtils.clearCookie(res, "better-auth.session_token", baseCookieOptions);
};

export const tokenUtils = {
  getAccessToken,
  getRefreshToken,
  setAccessTokenCookie,
  setRefreshTokenCookie,
  setBetterAuthSessionCookie,
  clearAuthCookies,
};
