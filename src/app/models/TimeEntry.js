import mongoose from "mongoose";

const TimeEntrySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    clockIn: {
        type: Date,
        required: true,
    },
    clockOut: {
        type: Date,
    },
    duration: {
        type: Number,
    },
}, { timestamps: true });

TimeEntrySchema.pre("save", function (next) {
    if (this.clockOut) {
        this.duration = (this.clockOut - this.clockIn) / (1000 * 60 * 60);
    }
    next();
});

export default mongoose.models.TimeEntry || mongoose.model("TimeEntry", TimeEntrySchema);

