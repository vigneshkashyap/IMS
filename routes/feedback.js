const   express         =   require("express"),
        router          =   express.Router(),
        passport        =   require("passport"),
        User            =   require("../models/User"),
        Policy          =   require("../models/Policy"),
        Feedback        =   require("../models/Feedback"),
        bcrypt          =   require('bcryptjs'),
        mongoose        =   require("mongoose");

const {
    isAdmin,
    isLoggedIn,
    authority
} = require('../helper/auth');    

router.get("/", isLoggedIn, (req, res) => {
    Feedback.find({}, (err, feedback) => {
        if(err){
            console.log(err);
        }else{
            res.render("feedback", {feedback: feedback, user: req.user})
        }
    });
});
router.post("/", isLoggedIn, (req, res) => {
    const F = {
        rating: req.body.rating,
        review: req.body.review,
        by: req.user.name
    };
    console.log(F);
    Feedback.create(F, (err, newFeed) => {
        if(err){
            console.log(err);
            res.render("feedback", {user: req.user});
        }else{
            newFeed.save((err, newF) => {
                if(err){
                    console.log(err);
                }else{
                    console.log(newF);
                    res.redirect("/dashboard");
                }
            });
        }
    });
});
module.exports = router;