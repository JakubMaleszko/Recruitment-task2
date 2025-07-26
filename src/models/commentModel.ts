import mongoose from "mongoose";


const CommentSchema = new mongoose.Schema({
    movie: {type: mongoose.Types.ObjectId, ref: 'Movie', required: true},
    content: String
});

export default mongoose.model('Comment', CommentSchema);