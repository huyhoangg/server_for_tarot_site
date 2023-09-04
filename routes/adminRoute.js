const adminControllers = require("../controllers/adminControllers.js")
const middlewareControllers = require("../controllers/middlewareControllers.js")

const router = require("express").Router()

router.get("/income/:interval", middlewareControllers.verifyAdminToken, adminControllers.getIncomeByInterval)



module.exports = router