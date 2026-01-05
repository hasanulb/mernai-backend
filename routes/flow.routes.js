const express = require("express");
const router = express.Router();
const flowController = require("../controllers/flow.controller");

router.get("/", flowController.healthCheck);
router.post("/ask-ai", flowController.askAI);
router.post("/save-flow", flowController.saveFlow);
router.get("/flows", flowController.getFlows);

module.exports = router;
