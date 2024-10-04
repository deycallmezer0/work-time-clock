import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide a name"],
        maxlength: [60, "Name cannot be more than 60 characters"],
    },
    email: {
        type: String,
        required: [true, "Please provide an email"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
    },
    hourlyRate: {
        type: Number,
        required: [true, "Please provide an hourly rate"],
    },
    role: {
        type: String,
        enum: ["employee", "manager"],
        default: "employee",
    },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", UserSchema);