const mongoose = require("mongoose")

const teamSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add the Team name."]
    },
    org_id: {
        type: String
    },
    selling_product: {
        type: String,
        required: [true, "Please add the Selling product name."]
    },
    admin_id: {
        type: String,
        required: [true, "Please add the Admin ID."]
    }
},
{
    timestamps: true
})

module.exports = mongoose.model("Team", teamSchema)