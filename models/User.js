const   mongoose                =   require("mongoose"),
        passportLocalMongoose   =   require("passport-local-mongoose"),
        Policy                  =   require("./Policy");

const UserSchema = new mongoose.Schema({
    phone: {type: String, required: true, unique: true},
    email: { type: String, required: true, unique: true},
    name: {type: String, required: true},
    password: {type: String, required: true},
    gender: String,
    PAN: String,
    DOB: Date,
    role: {type: String},
    policy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Policy' }],
    dateofreg: {type: Date, default: Date.now}
});
module.exports =  mongoose.model("User", UserSchema);