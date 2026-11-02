import jwt, { JwtPayload } from "jsonwebtoken";

const decodedToken = (token: string): JwtPayload | null => {
  const decoded = jwt.decode(token);
  return decoded && typeof decoded === "object" ? (decoded as JwtPayload) : null;
};

export const jwtUtils = { decodedToken };