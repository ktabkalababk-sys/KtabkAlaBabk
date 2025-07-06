import express from "express";
import { dbConn } from "./database/dbconnection.js";
import { AppError } from "./src/utils/appError.js";
import { globalError } from "./src/middleware/globalError.js";
import { bootstrap } from "./src/modules/bootstrap.js";
import dotenv from "dotenv";
dotenv.config();
const app = express();
const port = 3000;
app.use(express.static("Books"));
app.use(express.json());
app.get("/", (req, res) => res.send("Hello World!"));
bootstrap(app);

// app.use("*", (req, res, next) => {
//   next(new AppError(`route not found ${req.originalUrl}`, 404));
// });
app.use(globalError);
app.listen(port, () => console.log(`Klo Tmam ala elport da👌👌 ${port}!`));
