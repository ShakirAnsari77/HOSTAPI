const expressAsyncHandler = require("express-async-handler")
const Team = require("../models/teamModel")

//@desc Create a team
//@route POST /api/team/create
//@access public
const createTeam = expressAsyncHandler(async (req, res) => {
    const { name, selling_product } = req.body
    if (!name || !selling_product) {
        res.status(400)
        throw new Error("All fields are mandatory!")
    }

    try {
        const teamAvailable = await Team.findOne({ name, org_id: req.tokenObj.org_id })
    if (teamAvailable) {
        res.status(400);
        throw new Error("This team is already created.")
    }

    if (teamAvailable && (teamAvailable.org_id != req.tokenObj.org_id || req.tokenObj.role != "admin")) {
        res.status(400);
        throw new Error("User don't have permission to create teams.")
    }

    const team = await Team.create({
        name,
        org_id: req.tokenObj.org_id,
        selling_product,
        admin_id: req.tokenObj.id
    })
    console.log(`Team created ${team}`)
    if (team) {
        res.status(201).json(team)
    } else {
        res.status(400)
        throw new Error("Team data is not valid.")
    }

    } catch (error) {
        console.log(error)
    }
})

//@desc Get all teams
//@route GET /api/team/all
//@access private
const getAllTeams = expressAsyncHandler(async (req, res) => {
    if (req.tokenObj.role != "admin") {
        res.status(401)
        throw new Error("User don't have permission to view the teams list!")
    }
    const teams = await Team.find({ org_id: req.tokenObj.org_id })
    res.status(200).json(teams)
})

module.exports = { createTeam, getAllTeams }