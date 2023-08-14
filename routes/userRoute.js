const userControllers = require("../controllers/userControllers.js")
const middlewareControllers = require("../controllers/middlewareControllers.js")

const router = require("express").Router()

router.get("/profile", middlewareControllers.verifyToken, userControllers.profileUser)

router.post("/addToCart", middlewareControllers.verifyToken, userControllers.addToCart)

router.post("/removeOneFromCart", middlewareControllers.verifyToken, userControllers.removeFromCart)

router.post("/removeAllFromCart", middlewareControllers.verifyToken, userControllers.removeAllCart)

router.get("/getUserCart", middlewareControllers.verifyToken, userControllers.getUserCart)

module.exports = router