const   LocalStrategy   =   require("passport-local").Strategy,
        mongoose        =   require("mongoose"),
        User            =   require("../models/User"),
        bcrypt          =   require("bcryptjs");

module.exports  =   function(passport) {
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
    },
    function(username, password, done) {
        User.findOne({ email: username }, function (err, user) {
            if (err) { throw err; }
            if (!user) {
            return done(null, false, { message: 'Incorrect username.' });
            }
            bcrypt.compare(password, user.password, function(err, isMatch){
                if(err) throw err;
                if(isMatch){
                  return done(null, user);
                } else {
                  return done(null, false, {type: "danger", message: 'Wrong password'});
                }
              });
        });
    }
    ));
    passport.serializeUser(function(user, done) {
        done(null, user.id);
        });
    passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
    });
}
