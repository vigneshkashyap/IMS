const   express         =   require("express"),
        passport        =   require("passport"),
        mongoose        =   require("mongoose"),
        session         =   require("express-session"),
        flash           =   require('connect-flash'),
        methodOverride  =   require("method-override");

const app = express();

//DB CONFIG
const db = require('./config/keys').MongoURI || process.env.DATABASEURL;
mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("MongoDB Connected!"))
    .catch(err => console.log(err));

    const {
        isAdmin,
        isLoggedIn,
        authority
    } = require('./helper/auth'); 

//Session
app.use(session({
    secret: 'Vignesh',
    resave: false,
    saveUninitialized: false
}));

//Passport
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session()); 

//EJS
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(flash());
app.use(methodOverride("_method"));


// Dashboard Route
app.get('/dashboard', [isLoggedIn], (req, res) => {
    //console.log(req.originalUrl);
    res.render('dashboard', {user: req.user});
});
   
//Bodyparser
app.use(express.urlencoded({extended: false}));

//Routes
app.use("/",  require("./routes/index"));
app.use("/users",  require("./routes/users"));
app.use("/feedback", require("./routes/feedback"));
app.use("/policy", require("./routes/policy"));

//PORT
const PORT= process.send.PORT || 3000;
app.listen(PORT, console.log(`Server started at ${PORT}`));