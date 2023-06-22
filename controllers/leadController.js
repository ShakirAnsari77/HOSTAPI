const expressAsyncHandler = require("express-async-handler")
const Lead = require("../models/leadModel")
const Admin = require("../models/adminModel")
const Employee = require("../models/employeeModel")

//@desc Create a lead
//@route POST /api/lead/create
//@access public   
const createLead = expressAsyncHandler(async (req, res) => {
    const { name, email, contact_number, contact_person, address, importance, response, next_follow_up_date_time,
        assigned_to_team, assigned_to } = req.body

    if (!name || !email || !contact_number || !contact_person || !address || !importance) {
        res.status(400)
        throw new Error("All fields are mandatory!")
    }

    const leadAvailable = await Lead.findOne({ email })
    if (leadAvailable) {
        res.status(400);
        throw new Error("Lead is already created")
    }

    try {
        var leadObj = {}
        var objStatus = {}
        if (req.tokenObj.role == "admin") {
            var objStatus = {
                "assigned_to_team": assigned_to_team,
                "assigned_to": assigned_to,
                "created_by": req.tokenObj.id
            }
        } else if (req.tokenObj.role == "teamLeader") {
            var objStatus = {
                "assigned_to_team": req.tokenObj.team_id,
                "assigned_to": assigned_to,
                "created_by": req.tokenObj.id
            }
        } else {
            var objStatus = {
                "assigned_to_team": req.tokenObj.team_id,
                "assigned_to": req.tokenObj.id,
                "created_by": req.tokenObj.id
            }
        }
        leadObj = {
            name,
            email,
            contact_number,
            contact_person,
            address,
            importance,
            org_id: req.tokenObj.org_id,
            process: "created",
            last_assigned_to_team: assigned_to_team,
            last_assigned_to: assigned_to
        }
        objStatus.response = response
        objStatus.next_follow_up_date_time = next_follow_up_date_time
        var arrayStatus = []
        arrayStatus.push(objStatus)
        leadObj.status = arrayStatus
        console.log("Lead_Object", leadObj)
        // const lead = await Lead.create(leadObj, { $push: {status: arrayStatus} })
        const lead = await Lead.create(leadObj)
        if (lead) {
            res.status(201).json(lead)
        } else {
            res.status(400)
            throw new Error("Lead data is not valid.")
        }
    } catch (error) {
        console.log(error)
    }

})

//@desc Update a lead
//@route PUT /api/lead/update/:id
//@access public
const updateLead = expressAsyncHandler(async (req, res) => {
    const { name, email, contact_number, contact_person, address,
        importance, last_assigned_to_team, last_assigned_to } = req.body

    if (!name || !email || !contact_number || !contact_person || !address || !importance) {
        res.status(400)
        throw new Error("All fields are mandatory!")
    }

    const lead = await Lead.findById(req.params.id)
    if (!lead) {
        res.status(404);
        throw new Error("Lead not found")
    }

    if (lead.process == "completed") {
        res.status(404);
        throw new Error("This lead is already completed.")
    }

    if (req.tokenObj.role == "admin") {
        const admin = await Admin.findById(req.tokenObj.id)
        if (!admin) {
            res.status(404);
            throw new Error("Admin not found")
        }
        if (lead.org_id != req.tokenObj.org_id) {
            res.status(403)
            throw new Error("Admin don't have permission to update other organization's leads.")
        }
    } else if (req.tokenObj.role == "teamLeader") {
        const leader = await Employee.findById(req.tokenObj.id)
        if (!leader) {
            res.status(404);
            throw new Error("Team Leader not found")
        }
        if (lead.org_id != req.tokenObj.org_id || lead.last_assigned_to_team != req.tokenObj.team_id) {
            res.status(403)
            throw new Error("Leader don't have permission to update other organization's or tema's leads.")
        }
    } else {
        const employee = await Employee.findById(req.tokenObj.id)
        if (!employee) {
            res.status(404);
            throw new Error("Employee not found")
        }
        if (lead.org_id != req.tokenObj.org_id || lead.last_assigned_to_team != req.tokenObj.team_id ||
            lead.last_assigned_to != req.tokenObj.id) {
            res.status(403)
            throw new Error("Employee don't have permission to update other than his/her leads.")
        }
    }

    updatedLeadObject = {
        name,
        email,
        contact_number,
        contact_person,
        address,
        importance,
        last_assigned_to_team,
        last_assigned_to
    }


    console.log("Old Team ", lead.last_assigned_to_team, "    new team ", last_assigned_to_team, "    old assigned to ", lead.last_assigned_to, "      new assign to ", last_assigned_to);
    if (lead.last_assigned_to_team == last_assigned_to_team && lead.last_assigned_to == last_assigned_to) {
        console.log("if_condition");
        const updatedLead = await Lead.findByIdAndUpdate(req.params.id, { $set: { ...updatedLeadObject } }, { new: true })
        res.status(200).json(updatedLead)
    } else {
        console.log("if_condition else, ", updatedLeadObject);
        newStatusObject = {
            assigned_to_team: last_assigned_to_team,
            assigned_to: last_assigned_to,
            updated_by: req.tokenObj.id
        }
        const updatedLead = await Lead.findByIdAndUpdate(
            req.params.id,
            {
                $set: { ...updatedLeadObject },
                $push: { status: newStatusObject }
            },
            { new: true })
        res.status(200).json(updatedLead)
    }
})

//@desc Add a new status to a lead
//@route PUT /api/lead/addStatus/:id
//@access public
const addStatus = expressAsyncHandler(async (req, res) => {
    const { response, next_follow_up_date_time,
        rejection_reason, feedback_after_meeting, assigned_to_team, assigned_to } = req.body

    // if (!response || !next_follow_up_date_time || !address || !importance) {
    //     res.status(400)
    //     throw new Error("All fields are mandatory!")
    // }

    const lead = await Lead.findById(req.params.id)
    if (!lead) {
        res.status(404);
        throw new Error("Lead not found")
    }

    var newStatusObject = {}
    if (req.tokenObj.role == "admin") {
        const admin = await Admin.findById(req.tokenObj.id)
        if (!admin) {
            res.status(404);
            throw new Error("Admin not found")
        }
        if (lead.org_id != req.tokenObj.org_id) {
            res.status(403)
            throw new Error("Admin don't have permission to update other organization's leads.")
        }
        newStatusObject = {
            response,
            next_follow_up_date_time,
            feedback_after_meeting,
            assigned_to_team,
            assigned_to
        }
    } else if (req.tokenObj.role == "teamLeader") {
        const leader = await Employee.findById(req.tokenObj.id)
        if (!leader) {
            res.status(404);
            throw new Error("Team Leader not found")
        }
        if (lead.org_id != req.tokenObj.org_id || lead.last_assigned_to_team != req.tokenObj.team_id) {
            res.status(403)
            throw new Error("Team leader don't have permission to update other organization's leads.")
        }
        newStatusObject = {
            response,
            next_follow_up_date_time,
            feedback_after_meeting,
            assigned_to_team,
            assigned_to
        }
    } else {
        const employee = await Employee.findById(req.tokenObj.id)
        if (!employee) {
            res.status(404);
            throw new Error("Employee not found")
        }

        if (lead.org_id != req.tokenObj.org_id || lead.last_assigned_to_team != req.tokenObj.team_id ||
            lead.last_assigned_to != req.tokenObj.id) {
            res.status(403)
            throw new Error("Employee don't have permission to add status of leads belonging to other's leads.")
        }
        newStatusObject = {
            response,
            next_follow_up_date_time,
            feedback_after_meeting
        }

    }

    var process = ""
    if (response == "rejected") {
        newStatusObject.closed_by = req.tokenObj.id
        newStatusObject.rejection_reason = rejection_reason
        process = "completed"
        newStatusObject.status = "completed"
    } else if (response == "accepted") {
        newStatusObject.closed_by = req.tokenObj.id
        newStatusObject.status = "completed"
        process = "completed"
    } else {
        newStatusObject.updated_by = req.tokenObj.id
        newStatusObject.status = "ongoing"
        process = "ongoing"
    }

    const updateLead = await Lead.findByIdAndUpdate(
        req.params.id,
        {
            $set: { process: process },
            $push: { status: newStatusObject }
        },
        { new: true })
    res.status(200).json(updateLead)

})


//@desc Get a lead detail
//@route PUT /api/lead/details/:id
//@access public
const getLeadDetails = expressAsyncHandler(async (req, res) => {

    try {

        const lead = await Lead.findById(req.params.id)
        if (!lead) {
            res.status(404);
            throw new Error("Lead not found")
        }

        if (req.tokenObj.role == "admin") {
            const admin = await Admin.findById(req.tokenObj.id)
            if (!admin) {
                res.status(404);
                throw new Error("Admin not found")
            }
            if (lead.org_id != req.tokenObj.org_id) {
                res.status(403)
                throw new Error("Admin don't have permission to view other organization's leads.")
            }
        } else if (req.tokenObj.role == "teamLeader") {
            const leader = await Employee.findById(req.tokenObj.id)
            if (!leader) {
                res.status(404);
                throw new Error("Team Leader not found")
            }
            if (lead.org_id != req.tokenObj.org_id || lead.last_assigned_to_team != req.tokenObj.team_id) {
                res.status(403)
                throw new Error("Leader don't have permission to view other organization's or team's leads.")
            }
        } else {
            const employee = await Employee.findById(req.tokenObj.id)
            if (!employee) {
                res.status(404);
                throw new Error("Employee not found")
            }
            if (lead.org_id != req.tokenObj.org_id || lead.last_assigned_to_team != req.tokenObj.team_id ||
                lead.last_assigned_to != req.tokenObj.id) {
                res.status(403)
                throw new Error("Employee don't have permission to view other than his/her leads.")
            }
        }

        res.status(200).json(lead)
    } catch (error) {
        console.log(error);
    }
})


//@desc Get a all leads of organization
//@route PUT /api/lead/all
//@access public
const getAllOrgLeads = expressAsyncHandler(async (req, res) => {
    var leads1 = []

    Lead.find({ org_id: req.tokenObj.org_id }, 'name email address importance process last_assigned_to_team last_assigned_to org_id')
        .then((leads1) => {
            res.json(leads1);
        })
        .catch((err) => {
            console.error('Error occurred while querying the collection:', err);
            res.status(500).send('Internal Server Error');
        });


    if (req.tokenObj.role == "admin") {
        const admin = await Admin.findById(req.tokenObj.id)
        if (!admin) {
            res.status(404);
            throw new Error("Admin not found")
        }
        if ( leads1[1]["org_id"] != req.tokenObj.org_id) {
            res.status(403)
            throw new Error("Admin don't have permission to view other organization's leads.")
        }
    }

    res.status(200).json(leads1)
})



//@desc Delete Lead
//@route DELETE /api/lead/delete/:id
//@access private
const deleteLead = expressAsyncHandler(async (req, res) => {
    const lead = await Lead.findById(req.params.id)
    if (!lead) {
        res.status(404);
        throw new Error("Lead not found")
    }

    if ((req.tokenObj.role != "admin") || (req.tokenObj.role != "teamLeader") || (lead.org_id != req.tokenObj.org_id)) {
        res.status(403)
        throw new Error("User don't have permission to delete other lead.")
    }


    await Lead.deleteOne({ _id: req.params.id })

    res.status(200).json(lead)
})

module.exports = { createLead, updateLead, addStatus, getLeadDetails, getAllOrgLeads, deleteLead }