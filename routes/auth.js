const authControllers = require("../controllers/authControllers.js")
const middlewareControllers = require("../controllers/middlewareControllers.js")

const router = require("express").Router()

router.post("/register", authControllers.registerUser)
router.post("/login", authControllers.loginUser)
router.post("/logout", authControllers.logOutUser)

router.get("/test", middlewareControllers.verifyToken, (req, res)=>{
  res.send(req.user)
})


module.exports = router