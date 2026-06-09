import mongoose from "mongoose";
import { Schema } from "mongoose";

const User = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    eAdmin: {
        type: Number,
        default: 0
    },

    password: {
        type: String,
        required: true
    }
});

export default mongoose.model("users", User);