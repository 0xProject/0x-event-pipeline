
// load env vars
import { resolve } from "path";
import { config } from "dotenv";

config({ path: resolve(__dirname, "../../.env") });

console.log("App is running...");

// run pull and save fill events
require('./scripts/pull_and_save_fill_events');
