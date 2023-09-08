const adminControllers = require("../controllers/adminControllers.js");
const middlewareControllers = require("../controllers/middlewareControllers.js");

const router = require("express").Router();

router.get(
  "/income/:interval",
  middlewareControllers.verifyAdminToken,
  adminControllers.getIncomeByInterval
);

router.get(
  "/totalOrder",
  middlewareControllers.verifyAdminToken,
  adminControllers.getTotalPaidOrder
);

router.get(
  "/totalUser",
  middlewareControllers.verifyAdminToken,
  adminControllers.getTotalUser
);

router.get(
  "/allUser",
  middlewareControllers.verifyAdminToken,
  adminControllers.getAllUser
);

router.get(
  "/allProducts",
  middlewareControllers.verifyAdminToken,
  adminControllers.getAllProducts
);

router.get(
  "/allCategories/:type",
  middlewareControllers.verifyAdminToken,
  adminControllers.getAllCategories
);

router.post(
  "/updateProduct",
  middlewareControllers.verifyAdminToken,
  adminControllers.updateProduct
);

router.post(
  "/addProduct",
  middlewareControllers.verifyAdminToken,
  adminControllers.addProduct
);

router.post(
  "/deleteProduct/:productId",
  middlewareControllers.verifyAdminToken,
  adminControllers.deleteProduct
);

router.post(
  "/deleteCategory/:catId",
  middlewareControllers.verifyAdminToken,
  adminControllers.deleteCategory
);
router.post(
  "/updateCategory",
  middlewareControllers.verifyAdminToken,
  adminControllers.updateCategory
);
router.post(
  "/addCategory",
  middlewareControllers.verifyAdminToken,
  adminControllers.addCategory
);

router.get(
  "/upcomingOrder",
  middlewareControllers.verifyAdminToken,
  adminControllers.getAllUpcomingOrders
);

router.post(
  "/setDelivery/:productId",
  middlewareControllers.verifyAdminToken,
  adminControllers.setDelivery
);
router.get(
  "/adminVoucher",
  middlewareControllers.verifyAdminToken,
  adminControllers.getAdminVouchers
);
router.post(
  "/updateVoucher/:voucherId",
  middlewareControllers.verifyAdminToken,
  adminControllers.updateVoucher
);
router.post(
  "/createVoucher",
  middlewareControllers.verifyAdminToken,
  adminControllers.createVoucher
);
router.post(
  "/removeVoucher/:voucherId",
  middlewareControllers.verifyAdminToken,
  adminControllers.removeVoucher
);
module.exports = router;
