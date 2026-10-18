import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { envVars } from "../config/env";
import { prisma } from "./prisma";

const isProd = envVars.NODE_ENV === "production";

// In production, if frontend and backend are on different domains, none+secure is required (HTTPS is mandatory)
const cookieAttributes = {
  sameSite: isProd ? ("none" as const) : ("lax" as const),
  secure: isProd,
  httpOnly: true,
  path: "/",
};

export const auth = betterAuth({
  baseURL: envVars.AUTH.BETTER_AUTH_URL,
  secret: envVars.AUTH.BETTER_AUTH_SECRET,
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  trustedOrigins: [envVars.FRONTEND_ORIGIN],

  emailAndPassword: { enabled: true },

  socialProviders: {
    google: {
      clientId: envVars.OAUTH.GOOGLE_CLIENT_ID,
      clientSecret: envVars.OAUTH.GOOGLE_CLIENT_SECRET,
    },
    github: {
      clientId: envVars.OAUTH.GITHUB_CLIENT_ID,
      clientSecret: envVars.OAUTH.GITHUB_CLIENT_SECRET,
    },
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "USER",
        input: false, // The client cannot send the 'role' itself
      },
    },
  },

  // // user creation hook to set role based on email
  // databaseHooks: {
  //   user: {
  //     create: {
  //       before: async (user) => ({
  //         data: {
  //           ...user,
  //           role:
  //             user.email?.toLowerCase() ===
  //             envVars.AUTH.ADMIN_EMAIL.toLowerCase()
  //               ? "ADMIN"
  //               : "USER",
  //         },
  //       }),
  //     },
  //   },
  // },

  session: {
    expiresIn: 60 * 60 * 24, // 1 day
    updateAge: 60 * 60 * 24,
    cookieCache: { enabled: true, maxAge: 60 * 60 * 24 },
  },

  advanced: {
    useSecureCookies: isProd,
    cookies: {
      state: { attributes: cookieAttributes },
      sessionToken: { attributes: cookieAttributes },
    },
  },
});
