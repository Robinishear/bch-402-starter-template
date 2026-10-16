import createCors from "cors";
import { envVars } from "./env";

const origin = [envVars.FRONTEND_ORIGIN as string];

const cors = createCors({
  origin,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});

export { cors };

// 1\. How it works: It uses the `cors` package to control 
// communication permissions between the client
// (Next.js frontend) and the server (Express API). 
// The `credentials: true` option allows session cookies or authentication 
// tokens to be exchanged securely.