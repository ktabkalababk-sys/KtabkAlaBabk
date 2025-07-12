import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import cors from "cors";
import { dbConn } from "./database/dbconnection.js";
import { AppError } from "./src/utils/appError.js";
import { globalError } from "./src/middleware/globalError.js";
import { bootstrap } from "./src/modules/bootstrap.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.static("Books"));
app.use(express.json());

// 📦 FRONTEND SETUP
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve frontend static files
app.use(express.static(path.join(__dirname, "build")));

// 🚀 API ROUTES - Must come BEFORE the catch-all route
bootstrap(app);

// 🎯 SPA CATCH-ALL ROUTE - Must come AFTER all API routes
// This handles all frontend routes (like /cart, /home, etc.)
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// 🚨 GLOBAL ERROR HANDLER - Must be last
app.use(globalError);

app.listen(port, () => console.log(`Klo Tmam ala elport da👌👌 ${port}!`));
