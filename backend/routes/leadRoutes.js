const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  createLead,
  getLeads,
  updateLead,
  deleteLead,
  getLeadStats,
} = require("../controllers/leadController");

router.post("/", createLead);
router.get("/", getLeads);
router.get("/stats", getLeadStats);
router.put("/:id", updateLead);
router.delete("/:id", deleteLead);

module.exports = router;