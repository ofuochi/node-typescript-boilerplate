import mongoose from "mongoose";
import User from "../../core/entities/User";

const User = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: [true, "Please enter a full name"],
            index: true
        },
        lastName: {
            type: String,
            required: [true, "Please enter a full name"],
            index: true
        },
        email: {
            type: String,
            lowercase: true,
            unique: true,
            index: true
        },
        username: {
            type: String,
            lowercase: true,
            unique: true,
            index: true
        },
        tenantId: {
            type: String,
            unique: true,
            index: true
        },

        password: String,

        role: {
            type: String,
            enum: ["USER", "ADMIN"],
            default: "USER"
        }
    },
    { timestamps: true }
);

export default mongoose.model<UserDbContext>("User", User);
