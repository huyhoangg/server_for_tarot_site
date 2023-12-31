const userControllers = require("../controllers/userControllers.js")
const middlewareControllers = require("../controllers/middlewareControllers.js")

const router = require("express").Router()

router.get("/profile", middlewareControllers.verifyToken, userControllers.profileUser)

router.post("/profile", middlewareControllers.verifyToken, userControllers.updateProfileUser)

router.post("/addToCart", middlewareControllers.verifyToken, userControllers.addToCart)

router.post("/removeOneFromCart", middlewareControllers.verifyToken, userControllers.removeFromCart)

router.post("/removeAllFromCart", middlewareControllers.verifyToken, userControllers.removeAllCart)

router.get("/getUserCart", middlewareControllers.verifyToken, userControllers.getUserCart)

router.post("/create_payment_url", middlewareControllers.verifyToken, userControllers.userPayment)

router.post("/createInvoice", middlewareControllers.verifyToken, userControllers.createInvoice)

router.get("/checkInvoice", middlewareControllers.verifyToken, userControllers.checkInvoice)

router.get("/getInvoice/:orderId", middlewareControllers.verifyToken, userControllers.getInvoice)

router.get("/getInvoices", middlewareControllers.verifyToken, userControllers.getInvoices)

router.post("/postReview", middlewareControllers.verifyToken, userControllers.postReview)

router.get("/getReview", middlewareControllers.verifyToken, userControllers.getReview)

router.get("/getLoyaltyPoints", middlewareControllers.verifyToken, userControllers.getLoyaltyPoints)

router.get("/getLoyaltyInfo", middlewareControllers.verifyToken, userControllers.getLoyaltyInfo)

router.get("/getLoyaltyHistory", middlewareControllers.verifyToken, userControllers.getLoyaltyHistory)

router.get("/getRedeemVouchers", middlewareControllers.verifyToken, userControllers.getVouchersToRedeem)

router.post("/redeemVoucher", middlewareControllers.verifyToken, userControllers.redeemVoucher)

router.get("/getUserVouchers", middlewareControllers.verifyToken, userControllers.getUserVouchers)

router.get("/getUserVoucher/:voucherId", middlewareControllers.verifyToken, userControllers.getUserVoucher)

router.get("/getRewardToRedeem", middlewareControllers.verifyToken, userControllers.getRewardToRedeem)

router.post("/redeemReward", middlewareControllers.verifyToken, userControllers.redeemReward)


module.exports = router