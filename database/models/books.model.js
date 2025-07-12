import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    bookName: {
      type: String,
      required: true,
    },

    bookOwner: {
      type: String,
      required: true,
    },

    bookPrice: {
      type: Number,
      required: true,
    },

    numberOfBooks: {
      type: Number,
      required: true,
    },

    weightOfBooks: {
      type: Number,
      required: true,
    },
    gradeOfBooks: {
      type: String,
      enum: [
        "الصف الثالث الثانوى",
        "الصف الثانى الثانوى",
        "الصف الاول الثانوى",
      ],
      required: true,
    },

    isEmpty: {
      type: Boolean,
      default: true,
      required: true,
    },

    bookWeight: String,

    bookImage: String,

    bookImageId: String,
  },
  { versionKey: false, timestamps: true }
);

schema.virtual("isEmptyDynamic").get(function () {
  return this.numberOfBooks === 0;
});

schema.post("init", (doc) => {
  const baseURL = "https://ik.imagekit.io/papyrus/Books/BooksImages/";
  if (doc.bookImage) {
    if (doc.bookImage && !doc.bookImage.startsWith("http")) {
      doc.bookImage = baseURL + doc.bookImage;
    } else if (!doc.bookImage) {
      doc.bookImage = baseURL + "default.jpg";
    }
  }
});
export const Book = mongoose.model("Book", schema);
