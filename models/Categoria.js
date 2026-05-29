import mongoose, { mongo } from "mongoose"
const Schema = mongoose.Schema

const Categoria = new Schema({
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
        default: ""
    },
    date: {
        type: Date,
        default: Date.now

    }
})

export default mongoose.model('categorias', Categoria)