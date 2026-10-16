import morgan from "morgan";
import { envVars } from "./env";

const logger =
  envVars.NODE_ENV === "production" ? morgan("combined") : morgan("dev");

export { logger };


// How it works: It uses the `morgan`
// library to log HTTP requests. In production mode 
// (`combined`), it generates detailed logs,
// while in development mode (`dev`), it displays
// concise and color-coded logs.