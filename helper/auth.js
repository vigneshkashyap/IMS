module.exports = {
    isLoggedIn: function (req,res,next){
        if(req.isAuthenticated()){
            return next();
        }
        res.redirect("/users/login");
    },
    authority: function (req, res, next){
        if(req.user==="Admin" || req.user._id==req.params.id || req.params.AgentName==req.user.name)
            return next();
        res.redirect("/dashboard");
    },
    //Admin
    isAdmin: function (req, res, next){
        if(req.isAuthenticated() && req.user.role==="Admin"){
            return next();
        }
        res.redirect("/users/login")
    }
}