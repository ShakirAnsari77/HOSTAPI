const mongoose = require("mongoose")

const adminSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add the Admin name."]
    },
    email: {
        type: String,
        required: [true, "Please add the Admin email address."],
        unique: [true, "Email address already taken."]
    },
    password: {
        type: String,
        required: [true, "Please add the Admin password."]
    },
    org_id: {
        type: String
    }
},
{
    timestamps: true
})

module.exports = mongoose.model("Admin", adminSchema)