import status from "http-status";
import { APIError } from "better-auth/api";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import AppError from "../../error-helpers/AppError";
import { UserStatus } from "../../../generated/prisma";

const handleAuthError = (error: unknown): never => {
  if (error instanceof APIError) {
    throw new AppError(
      Number(error.statusCode) || status.BAD_REQUEST,
      error.message,
    );
  }
  throw error;
};

const registerUser = async (payload: {
  name: string;
  email: string;
  password: string;
}) => {
  try {
    const data = await auth.api.signUpEmail({ body: payload });
    if (!data.token) {
      throw new AppError(
        status.INTERNAL_SERVER_ERROR,
        "Session could not be created.",
      );
    }
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: data.user.id },
    });
    return { user, token: data.token };
  } catch (error) {
    return handleAuthError(error);
  }
};

const loginUser = async (payload: { email: string; password: string }) => {
  const existing = await prisma.user.findUnique({
    where: { email: payload.email },
  });
  if (
    existing &&
    (existing.isDeleted || existing.status !== UserStatus.ACTIVE)
  ) {
    throw new AppError(status.FORBIDDEN, "This account is not active.");
  }

  try {
    const data = await auth.api.signInEmail({ body: payload });
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: data.user.id },
    });
    return { user, token: data.token };
  } catch (error) {
    return handleAuthError(error);
  }
};

const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      status: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new AppError(status.NOT_FOUND, "User not found.");
  }
  return user;
};

const logoutUser = async (sessionToken?: string) => {
  if (sessionToken) {
    await prisma.session.deleteMany({ where: { token: sessionToken } });
  }
};

export const AuthService = { registerUser, loginUser, getMe, logoutUser };
