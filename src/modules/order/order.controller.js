import { Book } from "../../../database/models/books.model.js";
import { Cart } from "../../../database/models/cart.model.js";
import { Order } from "../../../database/models/order.model.js";
import { catchError } from "../../middleware/catchError.js";
import { uploadToImageKit } from "../../middleware/fileUpload.js";
import { AppError } from "../../utils/appError.js";
import ExcelJS from "exceljs";

const getAllOrders = catchError(async (req, res, next) => {
  let orders = await Order.find();
  if (req.body.cheacker == false) {
    if (!orders) return next(new AppError("there is no orders", 404));
    orders = await Order.find({
      isCheacked: false,
    })
      .select("-receiptImageId -updatedAt")
      .populate({
        path: "user",
        select: "userName phoneNumber address city", // Only these from User
      })
      .populate({
        path: "orderItems.book",
        select:
          "bookName bookOwner gradeOfBooks bookImage weightOfBooks bookPrice", // Only these from Book
      });
    res.status(201).json({ msg: "success", orders });
  } else {
    if (!orders) return next(new AppError("there is no orders", 404));
    orders = await Order.find({
      isCheacked: true,
    })
      .select("-receiptImageId -updatedAt")
      .populate({
        path: "user",
        select: "userName phoneNumber address city", // Only these from User
      })
      .populate({
        path: "orderItems.book",
        select:
          "bookName bookOwner gradeOfBooks bookImage weightOfBooks bookPrice", // Only these from Book
      });
    res.status(201).json({ msg: "success", orders });
  }
});

const getOrder = catchError(async (req, res, next) => {
  const order = await Order.findOne({ user: req.user.userId })
    .sort({ createdAt: -1 })
    .populate("user orderItems.book");
  if (!order) return next(new AppError("there is no orders", 404));
  res.status(201).json({ msg: "success", order });
});

const createOrder = catchError(async (req, res, next) => {
  let shipmentCost = [
    { city: "القاهرة", price: 10 },
    { city: "الجيزة", price: 20 },
    { city: "الإسكندرية", price: 30 },
    { city: "بورسعيد", price: 40 },
  ];
  let totalWeight = 0;

  const toDelete = await Order.deleteMany({
    isPaid: false,
    user: req.user.userId,
  });

  let cart = await Cart.findById(req.params.id).populate("user cartItems.book");
  if (!cart) return next(new AppError("there is no cart", 404));

  //calc the totalorderprice of the order
  let cityPrice = shipmentCost.find((item) => item.city === cart.user.city);
  let OrderPrice = cart.totalCartPrice + cityPrice.price;

  //calc the total weight of the order
  totalWeight = cart.cartItems.reduce((sum, item) => {
    return sum + item.book.weightOfBooks;
  }, 0);

  //calc the total extra weight price
  const extra = Math.max(0, totalWeight - 1000);
  OrderPrice = OrderPrice + Math.ceil(extra / 1000) * 15;

  //create order
  let order = new Order({
    user: req.user.userId,
    orderItems: cart.cartItems,
    totaOrderlWeight: totalWeight,
    totalOrderPrice: OrderPrice,
  });
  await order.save();
  let oldPrice = cart.totalCartPrice;
  // await Cart.findByIdAndDelete(cart._id);
  res.status(201).json({ msg: "success", order, oldPrice });
});

const confirmOrder = catchError(async (req, res, next) => {
  let order = await Order.findById(req.params.id);
  if (!order) return next(new AppError("there is no order", 404));
  if (req.files.receiptImage && req.files.receiptImage[0]) {
    const uploadResult = await uploadToImageKit(
      req.files.receiptImage[0],
      "ReceiptImage"
    );
    order.receiptImage = uploadResult.name;
    order.receiptImageId = uploadResult.fileId;
    order.senderNumber = req.body.senderNumber;
    order.isPaid = true;
    await order.save();
    res.status(201).json({ msg: "success", order });
    await Cart.findOneAndDelete({ user: req.user.userId });
  } else return next(new AppError("please add the receipt picture", 404));
});

const confirmPayment = catchError(async (req, res, next) => {
  let order = await Order.findById(req.params.id);
  if (!order) return next(new AppError("there is no order", 404));
  order.isCheacked = true;
  await order.save();
  const operations = order.orderItems.map((item) => ({
    updateOne: {
      filter: { _id: item.book }, // Find the book by its ID
      update: { $inc: { numberOfBooks: -item.quantity } }, // Subtract from numberOfBooks
    },
  }));
  await Book.bulkWrite(operations);
  res.status(201).json({ msg: "success" });
});

const excelFile = catchError(async (req, res, next) => {
  // 1. Fetch all orders from MongoDB, including user data
  const orders = await Order.find({ isCheacked: true })
    .select("user orderItems totaOrderlWeight isCheacked")
    .populate({
      path: "user",
      select: "userName phoneNumber address city", // Only these from User
    })
    .populate({
      path: "orderItems.book",
      select: "bookName", // Only these from Book
    })
    .lean();
  // console.log(orders);

  // 2. Create a new Excel workbook and worksheet
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Orders");

  // 3. Define the columns of the worksheet (Excel headers and data keys)
  worksheet.columns = [
    { header: "Description", key: "description", width: 40 },
    { header: "Total_Weight", key: "totalWeight", width: 15 },
    { header: "Customer_Name", key: "username", width: 20 },
    { header: "Mobile_No", key: "phoneNumber", width: 15 },
    { header: "Second_Mobile_No", key: "secondPhoneNumber", width: 18 },
    { header: "Street", key: "address", width: 25 },
    { header: "City", key: "city", width: 15 },
  ];

  // 4. List of allowed cities (dropdown options)
  const cities = ["Cairo", "Alexandria", "Giza", "Tanta", "Aswan"];

  orders.forEach((order, index) => {
    const descriptionText =
      order.orderItems
        ?.filter((item) => item?.book?.bookName && item?.quantity) // ✅ filter bad data
        .map((item) => `${item.book.bookName} (${item.quantity})`)
        .join("\n") || "N/A";

    const newRow = worksheet.addRow({
      description: descriptionText,
      totalWeight: order.totaOrderlWeight || "N/A",
      username: order.user?.userName || "N/A",
      phoneNumber: order.user?.phoneNumber || "N/A",
      secondPhoneNumber: order.user?.secondPhoneNumber || "N/A",
      address: order.user?.address || "N/A",
      city: order.user?.city || "N/A",
    });

    // Center align all cells in the worksheet
    worksheet.eachRow((row) => {
      row.eachCell((cell) => {
        cell.alignment = {
          vertical: "top",
          horizontal: "center",
          wrapText: true,
        };
      });
    });

    // ✅ Wrap text for the 'description' cell (assumed to be Column A = index 1)
    newRow.getCell(1).alignment = { wrapText: true };

    // ✅ Add dropdown validation to the 'City' cell (assumed to be column G = index 7)
    newRow.getCell(7).dataValidation = {
      type: "list",
      allowBlank: true,
      formulae: [`"${cities.join(",")}"`],
      showErrorMessage: true,
      errorTitle: "Invalid City",
      error: "Please select a valid city from the list.",
    };
  });

  // 7. Set response headers to force download
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader("Content-Disposition", "attachment; filename=orders.xlsx");

  // 8. Send the Excel file in the response
  await workbook.xlsx.write(res);
  res.end();
});
export {
  getAllOrders,
  createOrder,
  getOrder,
  confirmOrder,
  confirmPayment,
  excelFile,
};
