const mongoose = require("mongoose")

const leadSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add the name."]
    },
    email: {
        type: String,
        unique: [true, "Email address already taken."]
    },
    contact_number: {
        type: String,
        unique: [true, "Contact Number is already added."]
    },
    contact_person: {
        type: String,
    },
    address: {
        type: String
    },
    importance: {
        type: String
    },    
    process: {
        type: String
    },
    last_assigned_to_team: {
        type: String
    },
    last_assigned_to: {
        type:String
    },
    status: [{
        response: String,
        next_follow_up_date_time: String,
        assigned_to_team: String,
        assigned_to: String,
        created_by: String,
        updated_by: String,
        closed_by: String,
        rejection_reason: String,
        status: String,
        feedback_after_meeting: String
    }],
    org_id: {
        type: String
    }
},
    {
        timestamps: true
    })

module.exports = mongoose.model("Lead", leadSchema)