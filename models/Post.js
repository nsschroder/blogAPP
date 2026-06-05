import mongoose from "mongoose";
import { Schema } from "mongoose";

const Post = new Schema({
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    cont: {
        type: String,
        required: true
    },
    cat: {
        type: Schema.Types.ObjectId,
        ref: "categorias",
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }

})

export default mongoose.model('posts', Post)