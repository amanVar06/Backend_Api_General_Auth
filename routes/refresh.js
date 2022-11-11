const express = require("express");
const router = express.Router();
const refreshTokenController = require("../controllers/refreshTokenController");

//now it will be get route
router.get("/", refreshTokenController.handleRefreshToken);

module.exports = router;
