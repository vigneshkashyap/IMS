const   mongoose    =   require("mongoose"),
        User        =   require("./User");

const FeedbackSchema    =   new mongoose.Schema({
    rating: Number,
    review: String,
    by: String
});

module.exports = mongoose.model("Feedback", FeedbackSchema);