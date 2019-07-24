const mongoose = require("mongoose");

// use the mongoose Schema constructor 
const Schema = mongoose.Schema;

// create a model for the Articles collection.
// * this is basically a blueprint of what each article should look like in the Articles collection
const ArticleSchema = new Schema({
    title: {
        type: String, // specify type of data
        required: true, // every article in the collection MUST have a title
        unique: false  // every title saved in the collection MUST be different (no duplicates)
    },
    link: {
        type: String,
        required: true,
        unique: false
    },
    summary: {
        type: String,
        required: true,
        unique: false
    },
    time: {
        type: String,
        required: true
    },
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

let Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;