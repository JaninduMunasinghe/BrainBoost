import mongoose from "mongoose";
const Schema = mongoose.Schema;

const paymentSchema = new Schema({
    userId: {
        type: String,
        required: [true, "User id is required"],
    },
    courseId: {
        type: String,
        required: [true, "Course id is required"],
    },
    orderId: {
        type: Schema.Types.ObjectId,
        default: mongoose.Types.ObjectId,
    },
    paymentId: {
        type: Schema.Types.ObjectId,
        default: mongoose.Types.ObjectId,
    },
    amount: {
        type: Number,
        required: [true, "Amount is required"],
    },
    success: {
        type: Boolean,
        required: [true, "Success state is required"],
        default: false,
    },
});

export const Payment = mongoose.model("Payment", paymentSchema);
