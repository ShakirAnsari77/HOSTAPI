const express = require("express")
const { createTeam, getAllTeams } = require("../controllers/teamController")
const validateToken = require("../middleware/validateTokenHandler")

const router = express.Router()

router.use(validateToken)
router.post("/create", createTeam)

router.get("/all", getAllTeams)


module.exports = router