const publicControllers = require("../controllers/publicControllers.js")
// const middlewareControllers = require("../controllers/middlewareControllers.js")

const router = require("express").Router()

router.get("/products",  publicControllers.getProducts)
router.get("/products/:id",  publicControllers.getSingleProductByID)

router.get("/categories",  publicControllers.getCategories)



module.exports = router