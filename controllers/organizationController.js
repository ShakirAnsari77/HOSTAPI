const expressAsyncHandler = require("express-async-handler")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const Organization = require("../models/organizationModel")
const Admin = require("../models/adminModel")

//@desc Register an organization
//@route POST /api/organization/register
//@access private   
const registerOrganization = expressAsyncHandler(async(req, res) => {
    const { name, email, business_category } = req.body
    if (!name || !email || !business_category) {
        res.status(400)
        throw new Error("All fields are mandatory!")
    }
    const organizationAvailable = await Organization.findOne({ email })
    if (organizationAvailable) {
        res.status(400);
        throw new Error("Organization already registered")
    }

    const organization = await Organization.create({
        name,
        email,
        business_category,
        admin_id: req.tokenObj.id
    })

    const updateAdminData = await Admin.findByIdAndUpdate(req.tokenObj.id, {
        org_id: organization.id
    })

    console.log(`Organization created ${organization}  ${updateAdminData.org_id}`)
    if (organization) {
        res.status(201).json({ _id: organization.id, email: organization.email, organization: organization.business_category})
    } else {
        res.status(400)
        throw new Error("Organization data is not valid.")
    }
})

module.exports = { registerOrganization }