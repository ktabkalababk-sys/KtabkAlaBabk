import { connect } from "mongoose";

export const dbConn = connect("mongodb://localhost:27017/book")
  .then(() => {
    console.log("database connected*_*");
  })
  .catch((err) => console.log(err));
