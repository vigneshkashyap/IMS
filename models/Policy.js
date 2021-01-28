const   mongoose  =   require("mongoose");
const   User = require("./User");

const PolicySchema  =   new mongoose.Schema({
        name: String,
        validity: Number,
        company: String,
        cost: Number,
        terms: String,
        AgentName: String,
        approve: Boolean,
        Customers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
    });
module.exports = mongoose.model("Policy", PolicySchema);