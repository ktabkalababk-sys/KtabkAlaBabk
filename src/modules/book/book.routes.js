import { Router } from "express";
import {
  addBook,
  deleteBook,
  editBook,
  getAllBooks,
  searchBook,
} from "./book.controller.js";
import { fileUpload } from "../../middleware/fileUpload.js";
import { verifyToken } from "../../middleware/verifyToken.js";

const bookRouter = Router();
bookRouter.post(
  "/admin/addbook",
  verifyToken,
  fileUpload({}).fields([{ name: "bookImage", maxCount: 1 }]),
  addBook
);
bookRouter.get("/", searchBook);
bookRouter.put(
  "/admin/editbook/:id",
  verifyToken,
  fileUpload({}).fields([{ name: "bookImage", maxCount: 1 }]),
  editBook
);
bookRouter.delete("/admin/deletebook/:id", verifyToken, deleteBook);
bookRouter.get("/getbooks", getAllBooks);
export default bookRouter;
