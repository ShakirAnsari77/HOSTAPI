const mongoose = require("mongoose")

const organizationSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add the Organization name."]
    },
    email: {
        type: String,
        required: [true, "Please add the Organization email address."],
        unique: [true, "Email address already taken."]
    },
    business_category: {
        type: String,
        required: [true, "Please add the Organization business category."]
    },
    admin_id: {
        type: String,
        required: [true, "Please add the Admin ID."]
    }
},
{
    timestamps: true
})

module.exports = mongoose.model("Organization", organizationSchema)