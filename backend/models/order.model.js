// import mongoose from "mongoose";

// const orderSchema = new mongoose.Schema(
// 	{
// 		user: {
// 			type: mongoose.Schema.Types.ObjectId,
// 			ref: "User",
// 			required: true,
// 		},
// 		products: [
// 			{
// 				product: {
// 					type: mongoose.Schema.Types.ObjectId,
// 					ref: "Product",
// 					required: true,
// 				},
// 				quantity: {
// 					type: Number,
// 					required: true,
// 					min: 1,
// 				},
// 				price: {
// 					type: Number,
// 					required: true,
// 					min: 0,
// 				},
// 			},
// 		],
// 		totalAmount: {
// 			type: Number,
// 			required: true,
// 			min: 0,
// 		},
// 		stripeSessionId: {
// 			type: String,
// 			unique: true,
// 		},
// 	},
// 	{ timestamps: true }
// );

// const Order = mongoose.model("Order", orderSchema);

// export default Order;


// import mongoose from "mongoose";

// const addressSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   phoneNumber: { type: String, required: true },
//   pincode: { type: String, required: true },
//   houseNumber: { type: String, required: true },
//   streetAddress: { type: String, required: true },
//   landmark: { type: String },
//   city: { type: String, required: true },
//   state: { type: String, required: true },
// });

// const orderSchema = new mongoose.Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     products: [
//       {
//         product: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "Product",
//           required: true,
//         },
//         quantity: { type: Number, required: true, min: 1 },
//         price: { type: Number, required: true, min: 0 },
//       },
//     ],
//     totalAmount: { type: Number, required: true, min: 0 },
//     address: { type: addressSchema, required: true }, // 👈👈👈<-- added
//     stripeSessionId: { type: String, unique: true },
//   },
//   { timestamps: true }
// );

// const Order = mongoose.model("Order", orderSchema);

// export default Order;


import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  pincode: { type: String, required: true },
  houseNumber: { type: String, required: true },
  streetAddress: { type: String, required: true },
  landmark: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true, min: 0 },
      },
    ],
    totalAmount: { type: Number, required: true, min: 0 },
    address: { type: addressSchema, required: true },
    stripeSessionId: { type: String }, // keep field but do not make plain unique here
    razorpayOrderId: { type: String },    // new field for Razorpay
    razorpayPaymentId: { type: String },  // new field for Razorpay payment id
    status: { type: String, enum: ["pending", "paid", "cancelled"], default: "pending" },
    couponCode: { type: String, default: null },
  },
  { timestamps: true }
);

/**
 * Indexes:
 * - Make stripeSessionId unique only when present (partial index).
 * - Make razorpayOrderId and razorpayPaymentId unique only when present.
 * Partial indexes avoid the "multiple null" problem.
 */
orderSchema.index(
  { stripeSessionId: 1 },
  { unique: true, partialFilterExpression: { stripeSessionId: { $exists: true, $type: "string" } } }
);

orderSchema.index(
  { razorpayOrderId: 1 },
  { unique: true, partialFilterExpression: { razorpayOrderId: { $exists: true, $type: "string" } } }
);

orderSchema.index(
  { razorpayPaymentId: 1 },
  { unique: true, partialFilterExpression: { razorpayPaymentId: { $exists: true, $type: "string" } } }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
