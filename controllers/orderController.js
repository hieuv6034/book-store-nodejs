const Stripe = require('stripe');
//process.env not working
const stripe = Stripe(
  'sk_test_51L2suxEvR2fI04fev5mtTHoIsZ9VATmjvxVVxcbTrdej7KtQUOgklQeMrLW4Ibvk48ReZo7pA2C7fKqWA0zGG1ZU00zP6PIOpg'
);
const Cart = require('../models/cartModel');
const Book = require('../models/bookModel');
const Order = require('../models/orderModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./refactoryController');
exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get the currently booked tour
  const book = await Book.findById(req.params.bookId);

  // 2) Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/?book=${req.params.bookId}&user=${req.user.id}&price=${
      book.priceafterSale
    }&fullname=${req.body.fullname}&email=${req.body.email}&phone=${req.body.phone}&address=${req.body.address}&note=${
      req.body.note
    }`,
    cancel_url: `${req.protocol}://${req.get('host')}/book/${book.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.bookId,
    line_items: [
      {
        name: book.name,
        // description: book.description,
        images: [`/images/${book.img}`],
        amount: book.priceafterSale * 100,
        currency: 'usd',
        quantity: 1,
      },
    ],
  });
  // 3) Create session as response
  res.status(200).json({
    status: 'success',
    session,
  });
});

exports.createOrderCheckout = catchAsync(async (req, res, next) => {
  // This is only TEMPORARY, because it's UNSECURE: everyone can make bookings without paying
  const { book, user, price, fullname, phone, email, address, note } = req.query;
  if (!book && !user && !price) return next();
  await Order.create({
    book,
    user,
    price,
    paid: true,
    info: {
      fullname: fullname,
      email: email,
      address: address,
      phone: phone,
      pack:"Bọc Platis",
      note: note,
      payment: 'Chuyển khoản',
    },
  });
  //delete cart after payment
  await Cart.findOneAndDelete({ book, user });
  res.redirect(req.originalUrl.split('?')[0]);
});
exports.createOrderCod = catchAsync(async (req, res, next) => {
  const bookInfo = await Book.findById(req.params.bookId);
  const order = await Order.create({
    book: bookInfo._id,
    user: req.user.id,
    price: bookInfo.priceafterSale,
    paid: false,
    info: {
      fullname: req.body.fullname,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
      pack: req.body.pack,
      note: req.body.note,
      payment: 'Cod: Giao hàng nhận tiền',
    },
  });
  await Cart.findOneAndDelete({ book: req.params.bookId });
  res.status(201).json(order);
});

exports.getOneOrder = factory.getOne(Order);
exports.getAllOrder = factory.getAll(Order);
exports.deleteOneOrder = factory.deleteOne(Order);
exports.updateOneOrder = factory.updateOne(Order);
