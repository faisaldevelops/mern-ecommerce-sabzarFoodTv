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

    // 1) Unset stripeSessionId if explicitly null to avoid unique-null conflict
    const unsetResult = await Order.updateMany({ stripeSessionId: null }, { $unset: { stripeSessionId: "" } });
    console.log("Unset stripeSessionId on docs:", unsetResult.modifiedCount);

    // 2) Try drop old index if exists
    try {
      await Order.collection.dropIndex("stripeSessionId_1");
      console.log("Dropped old stripeSessionId_1 index");
    } catch (err) {
      console.log("No old stripeSessionId_1 index to drop or error (safe to ignore):", err.message);
    }

    // 3) Create partial/unique indexes
    await Order.collection.createIndex(
      { stripeSessionId: 1 },
      { unique: true, partialFilterExpression: { stripeSessionId: { $exists: true, $type: "string" } } }
    );
    console.log("Created partial unique index on stripeSessionId");

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
