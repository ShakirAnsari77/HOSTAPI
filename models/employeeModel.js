const mongoose = require("mongoose")

const employeeSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add the Employee name."]
    },
    email: {
        type: String,
        required: [true, "Please add the Employee email address."],
        unique: [true, "Email address already taken."]
    },
    password: {
        type: String,
        required: [true, "Please add the Employee password."]
    },
    role: {
        type: String,
        required: [true, "Please add the Employee role."]
    },
    admin_id: {
        type: String
    },
    team_id: {
        type:String
    },
    org_id: {
        type: String
    }
        
},
{
    timestamps: true
})

module.exports = mongoose.model("Employee", employeeSchema)