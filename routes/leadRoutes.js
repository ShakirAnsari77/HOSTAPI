const express = require("express")
const validateToken = require("../middleware/validateTokenHandler")
const { createLead, updateLead, addStatus, getLeadDetails, getAllOrgLeads, deleteLead  } = require("../controllers/leadController")
const checkPermissions = require("../middleware/permissionHandler")

const router = express.Router()

router.use(validateToken)
router.post("/create", createLead)
router.put("/update/:id", updateLead)
router.put("/addStatus/:id", addStatus)
router.get("/details/:id", getLeadDetails)
router.get("/all", getAllOrgLeads)
router.delete("/delete/:id", deleteLead)

module.exports = router
