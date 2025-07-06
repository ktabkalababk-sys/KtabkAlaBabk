import { Book } from "../../../database/models/books.model.js";
import { catchError } from "../../middleware/catchError.js";
import { deleteImage, uploadToImageKit } from "../../middleware/fileUpload.js";
import { AppError } from "../../utils/appError.js";

const addBook = catchError(async (req, res, next) => {
  let book = new Book(req.body);
  if (req.files.bookImage && req.files.bookImage[0]) {
    const uploadResult = await uploadToImageKit(
      req.files.bookImage[0],
      "BooksImages"
    );
    book.bookImage = uploadResult.name;
    book.bookImageId = uploadResult.fileId;
  }
  book = await book.save();
  res.status(201).json({ message: "Book added successfully", book });
});

const getAllBooks = catchError(async (req, res, next) => {
  let books = await Book.find();
  if (!books) return next(new AppError("Books not found"));
  res.status(201).json({ message: "successfully", books });
});

const editBook = catchError(async (req, res, next) => {
  const updatedBook = await Book.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true } 
  );
  if (!updatedBook) return next(new AppError("There is no book", 404));
  if (req.files.bookImage && req.files.bookImage[0]) {
    await deleteImage(updatedBook.bookImageId);
    const uploadResult = await uploadToImageKit(
      req.files.bookImage[0],
      "BooksImages"
    );
    updatedBook.bookImage = uploadResult.name;
    updatedBook.bookImageId = uploadResult.fileId;
  }
  await updatedBook.save();
  res.status(201).json({ message: "Updated", updatedBook });
});

const deleteBook = catchError(async (req, res, next) => {
  let deletedBook = await Book.findByIdAndDelete(req.params.id);
  if (!deletedBook) return next(new AppError("There is no book", 404));
  if (deletedBook.bookImageId) await deleteImage(deletedBook.bookImageId);
  res.status(201).json({ message: "Deleted" });
});

const searchBook = catchError(async (req, res, next) => {
  if (req.query.search) {
    let book = await Book.find({
      $or: [
        { bookName: { $regex: req.query.search, $options: "i" } },
        { bookOwner: { $regex: req.query.search, $options: "i" } },
      ],
    }).select("_id bookName bookOwner bookPrice gradeOfBooks isEmpty ");
    return res.status(201).json({ message: "success", book });
  }
  res.status(200).json({ message: "there is no user to search for" });
});
export { addBook, getAllBooks, editBook, deleteBook, searchBook };
