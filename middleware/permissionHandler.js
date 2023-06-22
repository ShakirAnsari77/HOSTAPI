const expressAsyncHandler = require("express-async-handler")
const Admin = require("../models/adminModel")
const Employee = require("../models/employeeModel")

const checkPermissions = expressAsyncHandler(async (req, res, next) => {
    try {
      const { role, id, org_id, team_id } = req.tokenObj;

      console.log("hii  ", role, "  ", id, "  ", org_id , "  ", team_id);
  
      if (role === "admin") {
        const admin = await Admin.findById(id);
        if (!admin) {
          res.status(404);
          throw new Error("Admin not found");
        }
        if (lead.org_id !== org_id) {
          res.status(403);
          throw new Error("Admin doesn't have permission to view other organization's leads.");
        }
      } else if (role === "teamLeader") {
        const leader = await Employee.findById(id);
        if (!leader) {
          res.status(404);
          throw new Error("Team Leader not found");
        }
        if (lead.org_id !== org_id || lead.last_assigned_to_team !== team_id) {
          res.status(403);
          throw new Error("Leader doesn't have permission to view other organization's or team's leads.");
        }
      } else {
        const employee = await Employee.findById(id);
        if (!employee) {
          res.status(404);
          throw new Error("Employee not found");
        }
        if (lead.org_id !== org_id || lead.last_assigned_to_team !== team_id || lead.last_assigned_to !== id) {
          res.status(403);
          throw new Error("Employee doesn't have permission to view other than his/her leads.");
        }
      }
  
      next();
    } catch (error) {
      next(error);
    }
  });

  module.exports = checkPermissions
  