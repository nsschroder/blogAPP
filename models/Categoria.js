import mongoose from "mongoose"
const Schema = mongoose.Schema

const Categoria = new schema({
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
        default: "null"
    },
    date: {
        type: Date,
        default: Date.now()

    }
})