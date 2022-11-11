const express = require("express");
const router = express.Router();
const logoutController = require("../controllers/logoutController");

//now it will be get route
router.get("/", logoutController.handleLogout);

module.exports = router;
