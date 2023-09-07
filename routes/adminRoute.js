const adminControllers = require("../controllers/adminControllers.js")
const middlewareControllers = require("../controllers/middlewareControllers.js")

const router = require("express").Router()

router.get("/income/:interval", middlewareControllers.verifyAdminToken, adminControllers.getIncomeByInterval)

router.get("/totalOrder", middlewareControllers.verifyAdminToken, adminControllers.getTotalPaidOrder)

router.get("/totalUser", middlewareControllers.verifyAdminToken, adminControllers.getTotalUser)

router.get("/allUser", middlewareControllers.verifyAdminToken, adminControllers.getAllUser)

router.get("/allProducts", middlewareControllers.verifyAdminToken, adminControllers.getAllProducts)

router.get("/allCategories/:type", middlewareControllers.verifyAdminToken, adminControllers.getAllCategories)

router.post("/updateProduct", middlewareControllers.verifyAdminToken, adminControllers.updateProduct)


module.exports = router