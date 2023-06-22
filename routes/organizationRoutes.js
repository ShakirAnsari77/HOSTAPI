const express = require("express")
const validateToken = require("../middleware/validateTokenHandler")
const { registerOrganization } = require("../controllers/organizationController")

const router = express.Router()

router.use(validateToken)
router.post("/register", registerOrganization)

module.exports = router
