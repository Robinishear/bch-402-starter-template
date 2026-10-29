import { envVars } from "../app/config/env";

//# TODO import paymentWatcher
// const ACTIVE_INTERVAL_MS = 3_000;  
export const ACTIVE_INTERVAL_MS = envVars.CHAIN_MODE === "real" ? 5_000 : 3_000;
export const IDLE_INTERVAL_MS = 30_000; 
export const BATCH_SIZE = 50;
//* DONE