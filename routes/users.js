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
//Login 
router.get("/login", (req, res) => res.render("login"));
router.post("/login", 
    passport.authenticate('local', { failureRedirect: "/users/login"}), 
    (req, res) => res.redirect("/dashboard"));

//Logout
router.get('/logout', function(req, res){
    req.logout();
    req.flash('success', 'You are logged out');
    res.redirect('/users/login');
});

//Register
router.get("/register", (req, res) => {
    const userrole="Invalid";
    const message = "";
    console.log(userrole);
    res.render("register", {message: message, user: userrole});
});
router.get("/add", isAdmin, (req, res) => {
    console.log(req.user.role);
    const message="";
    res.render("register", {message:message, user: req.user})
});
router.post("/register", (req, res) => {
    const   name= req.body.FirstName + ' ' + req.body.LastName,
            type= req.body.type,
            phone= req.body.phone,
            email= req.body.email,
            password= req.body.password,
            gender= req.body.Gender,
            pan= req.body.pan,
            date= req.body.date,
            role= req.body.role;
        let query = {email: email};
        User.findOne(query, function(err, user){
            const newUser = new User({
                name: name,
                phone: phone,
                email: email,
                password: password,
                gender: gender,
                PAN: pan,
                DOB: date,
                role: role
            });     
            if(user){
                res.render('register', {message: 'Username AND/OR Email already exists !', user: "Invalid"});
            }else{            
            bcrypt.genSalt(10, function(err, salt){
            bcrypt.hash(newUser.password, salt, function(err, hash){
                if(err){    
                console.log(err);
                return;
                }
            newUser.password = hash;
            newUser.save(function(err){
              if(err){
                console.log(err);
              }else {
                console.log(newUser);
                req.flash('success', 'The user : ' + newUser.name + ' is registered and can log in');
                res.redirect('/users/login');
              }
            });
          });
        });
      }       
    });    
});

//ADMIN ManageUser:
router.get("/manage", isAdmin, async (req, res) => {
    const users = await User.find({});
    res.render("mguser", {people: users, user: req.user});
});

//Get Details
router.get("/get/:id", isLoggedIn, (req, res) => {
    User.findOne({_id: req.params.id}, (err, foundUser) => {
        if(err){
            console.log(err);
        }else if(foundUser.policy.length==0){
            res.render("user", {person: foundUser, user: req.user});
        }else{
            console.log(foundUser);
            Policy.findOne({_id: foundUser.policy}, (err, foundPolicy) => {
                if(err){
                    console.log(err);
                }else{
                    var dateFormat = require('dateformat');
                    const d = foundUser.dateofreg;
                    const dateofreg = dateFormat(d, "dd/mm/yyyy, h:MM TT")
                    res.render("user", {person: foundUser, user:req.user, policy: foundPolicy.name, dateofreg: dateofreg});
                }
            });
        }
    });
});
router.get("/find/policy", isLoggedIn, (req, res) => {
    if(req.user.policy.length==0){
        res.redirect("/dashboard");
    }else{
        const pol=req.user.policy;
        res.redirect("/policy/get/"+pol);
    }
});
//Update Details
router.put("/get/:id", isLoggedIn, (req, res) => {
    const obj=req.body;
    delete obj.policy;
    User.findByIdAndUpdate(req.params.id, {"$set": obj}, (err, newUser) => {
        if(err){
            console.log(err);
        }else{
            res.redirect("/dashboard");
        }
    });
});
//Delete User
router.delete("/get/:id", isAdmin, (req, res) => {
    User.findByIdAndRemove(req.params.id, (err) => {
        if(err){
            console.log(err);
        }else{
            res.redirect("/dashboard");
        }
    });
});

module.exports = router;