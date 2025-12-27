// scripts/fixOrderIndexes.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Order from "../backend/models/order.model.js"; // adjust path if needed

dotenv.config({ path: "./.env" });

async function run() {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    console.log("Connected to DB");

    // Create partial/unique indexes
    await Order.collection.createIndex(
      { razorpayOrderId: 1 },
      { unique: true, partialFilterExpression: { razorpayOrderId: { $exists: true, $type: "string" } } }
    );
    console.log("Created partial unique index on razorpayOrderId");

    await Order.collection.createIndex(
      { razorpayPaymentId: 1 },
      { unique: true, partialFilterExpression: { razorpayPaymentId: { $exists: true, $type: "string" } } }
    );
    console.log("Created partial unique index on razorpayPaymentId");

    console.log("Migration finished");
  } catch (err) {
    console.error("Migration error:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected");
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
