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

//AGENT LIST POLICY
router.get("/listpolicy", isLoggedIn, (req,res) => {
    res.render("listPolicy", {user: req.user});
});

router.post("/listpolicy", isLoggedIn, (req,res) => {
    console.log(req.body.cost);
    const P = {
        name: req.body.name,
        validity: req.body.validity,
        company: req.body.company,
        cost: req.body.cost,
        terms: req.body.terms,
        AgentName: req.user.name,
        approve: 0
    };
    Policy.create(P, (err, newPolicy) => {
        if(err){
            console.log(err);
            res.render("listPolicy");
        }else{
            newPolicy.save((err, newP) => {
                if(err){
                    console.log(err);
                }else{
                    console.log(newP);
                    res.render("dashboard", {user: req.user});
                }
            });
        }
    });
}); 
router.get("/mypolicy", isLoggedIn, (req, res) => {
    Policy.find({AgentName: req.user.name}, (err, policies) => {
        if(err){
            console.log(err);
        }else{
            res.render("getPolicy", {policy: policies, user: req.user})
        }
    });
})
//User GET
router.get("/getpolicy", isLoggedIn, (req, res) => {
    Policy.find({}, (err, policies) => {
        if(err){
            console.log(err);
        }else{
            res.render("getPolicy", {policy: policies, user: req.user});
        }
    });
});
//ADMIN Approve
router.get("/approve", isAdmin, async (req, res) =>{
    const policies = await Policy.find({});
    res.render("approve", {policy: policies, user: req.user});
});
//Manage Policy
router.get("/manage", isAdmin, (req, res) =>{
    Policy.find({}, (err, policies) => {
        if(err){
            console.log(err);   
        }else{
            console.log(req.query.sorted)
            if(req.query.sorted){
            const field = req.query.sorted;            
            policies.sort((a, b) => (a[field] > b[field]) ? 1 : -1);           
            }
            res.render("mgpolicy", {policy: policies, user: req.user});
        }
    });
});

router.get("/select/:id", isLoggedIn, (req, res) => {
    let ts= Date.now();
    let ob_date=new Date(ts);
    console.log(ob_date);
    User.findByIdAndUpdate( req.user._id, {"$set": {policy: req.params.id, dateofreg: ob_date}}, (err, newUser) => {
        if(err){
            console.log(err);
        }else{
            res.redirect("/dashboard");
        }
    });
});
router.get("/payment/:id", isLoggedIn, (req, res) =>{
    Policy.findOne({_id: req.params.id}, (err, foundPolicy) => {
        if(err){
            console.log(err);
        }else{
            res.render("payment", {user: req.user, policy: foundPolicy});
        }
    });
});

//Edit Policy
router.get("/get/:id", isLoggedIn, (req, res) => {
    Policy.findOne({_id: req.params.id}, (err, foundPolicy) => {
        if(err){
            console.log(err);
        }else{
            let option=0;
            if(req.user.policy.length>0 && req.user.policy[0].equals(foundPolicy._id)){
                option=1;
            }
            res.render("policy", {policy: foundPolicy, user: req.user, option: option});
        }
    });
});
//Approve Policy
router.put("/get/:id", isAdmin, (req, res) => {
    Policy.findByIdAndUpdate(req.params.id, {"$set": {approve: 1}}, (err, newPolicy) => {
        if(err){
            console.log(err);
            res.redirect("/policy/approve");
        }else{
            res.redirect("/policy/approve");
        }
    });
});
//Delete Policy
router.delete("/get/:id", isLoggedIn, (req, res) => {
    Policy.findByIdAndRemove(req.params.id, (err) => {
        if(err){
            console.log(err);
        }else if(req.user.role=="Agent"){
            res.redirect("/policy/mypolicy");
        }else if(req.user.role=="Admin"){
            res.redirect("/policy/manage");
        }
    });
});

router.put("/remove/:id", isLoggedIn, (req, res) => {
    const pid=req.user.policy[0];
    User.findByIdAndUpdate(req.params.id, {'$pullAll': {policy : [pid]}}, (err, newUser) => {
        if(err){
            console.log(err);
        }else{
            res.redirect("/policy/getpolicy")
        }
    });
});

module.exports = router;